//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Goals {

    struct Group {
        string groupName;
        uint256 durationDays;
        bool isValue;
        uint256 endTime;
        uint256 totalStake;
        uint256 baseAmount;

        address groupOwner;
        int96 numberMembers;
        int96 numberVotes;
        Stake[] members;
        Proof[] proofs;
        mapping(address => uint256) vetos;
    }

    struct Stake {
        address source;
        string goalTitle;
        string goalDescription;
        uint256 stake;
    }

    struct Proof {
        address source;
        string proof;
    }

    event GroupCreated(string groupName);

    event GroupJoined(string groupName, address member);

    event ProofSubmitted(string groupName, address member, string proof);

    event VoteSubmitted(string groupName, address member);

    event GroupStarted(string groupName, uint256 endTime);

    event GroupDistributed(string groupName, address[] eligible);

    mapping(string => Group) public groups;

    IERC20 private stakingToken;
    uint256 private granularity;

    constructor(IERC20 _stakingToken, uint256 _granularity) {
        stakingToken = _stakingToken;
        granularity = _granularity;
    }

    function getMembers(string calldata _groupName) public view returns (Stake[] memory) {
        if (groups[_groupName].isValue) {
            return groups[_groupName].members;
        } else {
            return new Stake[](0);
        }
    }

    function groupExists(string calldata _groupName) public view returns (bool) {
        return groups[_groupName].isValue;
    }

    function createGroup(string calldata _groupName, uint256 _durationDays, uint256 _amount) public {
        if (groups[_groupName].isValue) {
            revert('Group already exists');
        }


        groups[_groupName].groupName = _groupName;
        groups[_groupName].durationDays = _durationDays;
        groups[_groupName].isValue = true;
        groups[_groupName].groupOwner = msg.sender;
        groups[_groupName].baseAmount = _amount;
        emit GroupCreated(_groupName);
    }

    function joinGroup(string calldata _groupName, string calldata _goalTitle, string calldata _goalDescription) onlyValidGroup(_groupName) public {
        if (!groups[_groupName].isValue) {
            revert('Group does not exist');
        }
        for (uint256 i = 0; i < groups[_groupName].members.length; i++) {
            if (groups[_groupName].members[i].source == msg.sender) {
                revert('Already staked');
            }
        }

        groups[_groupName].members.push(Stake({
            goalTitle: _goalTitle,
            goalDescription: _goalDescription,
            stake: groups[_groupName].baseAmount,
            source: msg.sender
        }));

        if ((stakingToken.allowance(msg.sender, address(this)) < groups[_groupName].baseAmount)) {
            revert('ERC20 allowance is too small');
        }

        if (!stakingToken.transferFrom(msg.sender, address(this), groups[_groupName].baseAmount)) {
            revert('ERC20 transfer failed');
        }

        groups[_groupName].numberMembers++;
        groups[_groupName].totalStake += groups[_groupName].baseAmount;
        emit GroupJoined(_groupName, msg.sender);
    }

    function start(string calldata _groupName) onlyGroupOwner(_groupName) onlyValidGroup(_groupName) public {
        // do something with stake
        uint256 endTimeCalculated = block.timestamp + groups[_groupName].durationDays * granularity;
        groups[_groupName].endTime = endTimeCalculated;
        emit GroupStarted(_groupName, endTimeCalculated);
    }

    function submitProof(string calldata _groupName, string calldata _proof) onlyValidGroup(_groupName) public {
        if (block.timestamp > groups[_groupName].endTime) {
            revert('Group expired');
        }
        groups[_groupName].proofs.push(Proof({
            source: msg.sender,
            proof: _proof
        }));
        emit ProofSubmitted(_groupName, msg.sender, _proof);
    }

    function submitVetos(string calldata _groupName, address[] memory _vetoAddresses) public onlyValidGroup(_groupName) {
        if (_vetoAddresses.length > 0) {
            for (uint256 i = 0; i < _vetoAddresses.length; i++) {
                groups[_groupName].vetos[_vetoAddresses[i]] += 1;
            }
        }
        groups[_groupName].numberVotes++;
        emit VoteSubmitted(_groupName, msg.sender);
    }

    function distribute(string calldata _groupName) public onlyValidGroup(_groupName)  {
        if (groups[_groupName].endTime == 0) {
            revert('Group was not started');
        }

        if (groups[_groupName].endTime > block.timestamp) {
            revert('Group has not expired yet');
        }

        if (groups[_groupName].numberMembers > groups[_groupName].numberVotes) {
            // not everybody voted, potentially nudge poeple with push protocol to vote
            revert('Not everybody has voted');
        }

        // count members where the majority voted for yes

        uint256 eligibleCount = 0;
        for(uint256 i = 0; i < groups[_groupName].members.length; i++) {
            address source = groups[_groupName].members[i].source;
            uint256 vetos = groups[_groupName].vetos[source]*2;
            if (vetos < groups[_groupName].members.length) {
                eligibleCount += 1;
            }
        }

        address[] memory eligible = new address[](eligibleCount);
        uint256 k = 0;
        for(uint256 i = 0; i < groups[_groupName].members.length; i++) {
            address source = groups[_groupName].members[i].source;
            uint256 vetos = groups[_groupName].vetos[source]*2;
            if (vetos < groups[_groupName].members.length) {
                eligible[k] = source;
                k += 1;
            }
        }

        // 5 members -> 3 voted yes, 2 voted no, 2*2 < 5 -> eligible
        // 5 members -> 2 voted yes, 3 voted no, 3*2 > 5 -> not eligible

        uint256 totalStake;
        uint256 stakePerMember = totalStake/eligible.length;
        for (uint256 i = 0 ; i < eligible.length; i++) {
            if (i == eligible.length-1) {
                // drain stake for last member
                stakingToken.transferFrom(address(this), eligible[i], totalStake);
            } else {
                stakingToken.transferFrom(address(this), eligible[i], stakePerMember);
            }
            totalStake -= stakePerMember;
        }
        emit GroupDistributed(_groupName, eligible);

        // depending on the strategy, redistribute the funds to the owners, i.e. winner
    }

    function getGroupOwner(string calldata _groupName) onlyValidGroup(_groupName) public view returns (address) {
        return groups[_groupName].groupOwner;
    }

    function getMembers(string calldata _groupName) onlyValidGroup(_groupName) public view returns (address[] memory) {
        address[] memory members = new address[](groups[_groupName].members.length);
        for (uint256 i = 0; i < groups[_groupName].members.length; i++) {
            members[i] = groups[_groupName].members[i].source;
        }
        return members;
    }

    function getProofs(string calldata _groupName) onlyValidGroup(_groupName) public view returns (Proof[] memory) {
        return groups[_groupName].proofs;
    }

    modifier onlyValidGroup(string calldata _groupName) {
        if (!groups[_groupName].isValue) {
            revert('Group does not exist');
        }
        _;
    }

    modifier onlyGroupOwner(string calldata _group) {
        if (msg.sender != groups[_group].groupOwner) {
            revert('Only group owner');
        }
        _;
    }
}
