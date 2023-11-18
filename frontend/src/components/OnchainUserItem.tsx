import {
  Typography,
  Avatar,
  Tag,
  Button,
  MagnifyingGlassSVG,
  CheckSVG,
  CrossSVG
} from '@ensdomains/thorin'
import {
  MemberRow,
  MemberDescription
} from '@/components/Goal';
import { useContractRead } from 'wagmi'
import GoalsABI from "@/lib/abi/full-goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import {useEffect, useMemo, useState} from 'react';
import { shortAddress } from '@/lib/utils';
import {useSimpleAccount} from "@/components/SponsoredTransaction";

type Props = {
  name: string,
  groupExists: boolean,
  numberOfMembers: number,
  step: string,
  index: number,
  address: `0x${string}`,
  approvalState: boolean,
  setApprovalState: (state: boolean) => void,
  allProofs?: string[],
}

const DEFAULT_IMAGE = "https://ipfs.io/ipfs/bafybeigauplro2r3fyn5443z55dp2ze5mc5twl5jqeiurulyrnociqynkq/male-2-8-15-10-8-2-11-9.png";

type MemberInfo = {
  goalDescription: string,
  goalTitle: string,
  source: `0x${string}`,
  stake: number,
}

export async function OnchainUserItem({name, groupExists, numberOfMembers, step, index, approvalState, setApprovalState, allProofs}: Props) {
  const { getSenderAddress } = useSimpleAccount();
  const [ address, setAddress ] = useState<`0x${string}`>();
  const { data: memberInfo }: {data?: MemberInfo, isLoading: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "getMemberOfGroupByIndex",
    args: [name, index],
    enabled: (!!name && !!groupExists && numberOfMembers > 0)
  });

  const foundProofIndex = useMemo(() => {
    if (!memberInfo?.source) return -1;
    if (allProofs && allProofs?.length > 0) {
      return allProofs.findIndex((p) => {
        return p == memberInfo?.source
      })
    } else {
      return -1
    }
  }, [allProofs, memberInfo, memberInfo?.source]);

  const { data: proof }: {data?: {proof: string, source: string }, isLoading: boolean, isError: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "getProofOfGroupByIndex",
    args: [name, foundProofIndex],
    enabled: (!!name && !!groupExists && foundProofIndex >= 0)
  });

  useEffect(() => {
    const fetchSenderAddress = async() => {
      const address = await getSenderAddress();
      setAddress(address);
    }
    fetchSenderAddress();
  }, []);

  const isSelf = address == memberInfo?.source;

  const approve = () => {
    setApprovalState(true);
  }

  const reject = () => {
    setApprovalState(false);
  }

  const viewProof = () => {
    if (proof && proof.proof) {
      window.open(proof.proof, '_blank');
    }
  };

  const renderListActions = () => {
    switch(step) {
      case "vote":
        if (proof) {
          return isSelf ? (
            <Button colorStyle='transparent' shape="square" className='ml-auto'>
              <MagnifyingGlassSVG />
            </Button>
          ) : (
            <>
              <Button colorStyle='transparent' shape="square" className='ml-auto' onClick={() => viewProof()}>
                <MagnifyingGlassSVG />
              </Button>
              <Button colorStyle={approvalState ? 'greenPrimary' : 'greenSecondary'} shape="square" onClick={() => approve()}>
                <CheckSVG />
              </Button>
              <Button colorStyle={approvalState ? 'redSecondary' : 'redPrimary'} shape="square" onClick={() => reject()}>
                <CrossSVG />
              </Button>
            </>
          )
        } else {
          return <Tag className="ml-auto" colorStyle="blueSecondary">Waiting for proof</Tag>
        }
      case "distribute":
        return <>
          <Button colorStyle='transparent' shape="square" className='ml-auto'>
            <MagnifyingGlassSVG />
          </Button>
        </>
      default:
        return null;
    }
  }

  return (
    <MemberRow>
      <div style={{ minWidth: '50px' }}>
        <Avatar label='profile_picture' src={DEFAULT_IMAGE}/>
      </div>
      <MemberDescription>
        <Typography asProp='p' fontVariant='body'>{shortAddress(memberInfo?.source || "")}</Typography>
        <Typography asProp='p' fontVariant='small'>{memberInfo?.goalTitle}</Typography>
      </MemberDescription>
      {renderListActions()}
    </MemberRow>
  )
}
