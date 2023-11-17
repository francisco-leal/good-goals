//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Goals {

    struct Group {
        string groupName;
        uint256 durationDays;
        bool isValue;
        uint256 endTime;

        address groupOwner;
        mapping(address => Stake) members;
        mapping(address => Vote) votes;
    }

    struct Vote {
        address[] members;
        bool[] votes;
    }

    struct Stake {
        string goalTitle;
        string goalDescription;
        uint256 stake;
    }

    event GroupCreated(string groupName);

    event GroupJoined(string groupName, address member);

    event ProofSubmitted(string groupName, address member, string proof);

    event VoteSubmitted(string groupName, address member);

    event GroupStarted(string groupName);

    mapping(string => Group) groups;

    IERC20 private stakingToken;
    uint256 private granularity;

    constructor(IERC20 _stakingToken, uint256 _granularity) {
        stakingToken = _stakingToken;
        granularity = _granularity;
    }

    function createGroup(string calldata _groupName, uint256 _durationDays) public {
        if (groups[_groupName].isValue) {
            revert('Group already exists');
        }

        uint256 endTimeCalculated = block.timestamp + _durationDays * granularity;
        groups[_groupName].groupName = _groupName;
        groups[_groupName].durationDays = _durationDays;
        groups[_groupName].endTime = endTimeCalculated;
        groups[_groupName].isValue = true;
        groups[_groupName].groupOwner = msg.sender;
        emit GroupCreated(_groupName);
    }

    function joinGroup(string calldata _groupName, string calldata _goalTitle, string calldata _goalDescription, uint256 _amount) public {
        if (!groups[_groupName].isValue) {
            revert('Group does not exist');
        }
        if (groups[_groupName].members[msg.sender].stake > 0) {
            revert('Already staked');
        }
        groups[_groupName].members[msg.sender] = Stake({
            goalTitle: _goalTitle,
            goalDescription: _goalDescription,
            stake: _amount
        });

        if (!stakingToken.approve(msg.sender, _amount)) {
            revert('ERC20 approval failed');
        }

        if (!stakingToken.transferFrom(msg.sender, address(this), _amount)) {
            revert('ERC20 transfer failed');
        }

        emit GroupJoined(_groupName, msg.sender);
    }

    function start(string calldata _groupName) onlyGroupOwner(_groupName) public {
        // do something with stake
        emit GroupStarted(_groupName);
    }

    function submitProof(string calldata _groupName, string calldata _proof) public {
        if (block.timestamp > groups[_groupName].endTime) {
            revert('Group expired');
        }
        emit ProofSubmitted(_groupName, msg.sender, _proof);
    }

    function submitVote(string calldata _groupName, address[] memory _addresses, bool[] memory _votes) public {
        if (_addresses.length != _votes.length) {
            revert('Invalid parameter');
        }

        if (!groups[_groupName].isValue) {
            revert('Group does not exist');
        }

        groups[_groupName].votes[msg.sender].members = _addresses;
        groups[_groupName].votes[msg.sender].votes = _votes;
        emit VoteSubmitted(_groupName, msg.sender);
    }

    function distribute(string calldata _groupName) onlyGroupOwner(_groupName) public {
        // depending on the strategy, redistribute the funds to the owners, i.e. winner
    }

    modifier onlyGroupOwner(string calldata _group) {
        if (msg.sender != groups[_group].groupOwner) {
            revert('Only group owner');
        }
        _;
    }
}
