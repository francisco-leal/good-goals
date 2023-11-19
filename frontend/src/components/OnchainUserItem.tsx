import {
  Typography,
  Avatar,
  Tag,
} from '@ensdomains/thorin'
import {
  MemberRow,
  MemberDescription
} from '@/components/Goal';
import { useContractRead, useAccount } from 'wagmi'
import GoalsABI from "@/lib/abi/full-goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import { useMemo } from 'react';
import { shortAddress } from '@/lib/utils';

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

const DEFAULT_IMAGES = [
  "https://i.seadn.io/gae/tKTl6AmyJgf4gKOCgQmE5zd4iRQ0G8YsAsxXzOAqcgGCFx9jV3PKz6ajOQiKmarBUmAPIwBdGI-amV03A955-hJAFvKl8eXvO4B4qQ?auto=format&dpr=1&w=1000",
  "https://i.seadn.io/gcs/files/0411a6c5fc828c828b0b8346f5c2661a.png?auto=format&dpr=1&w=1000",
  "https://i.seadn.io/gae/l4OW979vFhC9Ev-WLXEYaUDlhtWAwcY99evPCrhaT_S-jlQ8iI3dg-hrdYYgNoFagmlLjG6wsJmMxog02C6Jvuj6Q4vR6QptTqlQ?auto=format&dpr=1&w=1000"
]

type MemberInfo = {
  goalDescription: string,
  goalTitle: string,
  source: `0x${string}`,
  stake: number,
}

export function OnchainUserItem({name, groupExists, numberOfMembers, step, index, address, approvalState, setApprovalState, allProofs}: Props) {
  const { address: viwerWallet } = useAccount();
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

  console.log({memberInfo, index});

  const { data: proof }: {data?: {proof: string, source: string }, isLoading: boolean, isError: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI.abi,
    functionName: "getProofOfGroupByIndex",
    args: [name, foundProofIndex],
    enabled: (!!name && !!groupExists && foundProofIndex >= 0)
  });

  const isSelf = viwerWallet == memberInfo?.source;

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

  const winnerTag = () => {
    if (step == "finished" || step == "distribute") {
      if(index == 0) {
        return <><Tag className="ml-auto">Winner</Tag><Tag colorStyle="greenPrimary">3,000 $APE</Tag></>
      } else {
        return <Tag className="ml-auto" colorStyle="redPrimary">$0</Tag>
      }
    }
    return;
  }

  return (
    <MemberRow>
      <div style={{ minWidth: '50px' }}>
        <Avatar label='profile_picture' src={DEFAULT_IMAGES[index]}/>
      </div>
      <MemberDescription>
        <Typography asProp='p' fontVariant='body'>{shortAddress(memberInfo?.source || "")}</Typography>
        <Typography asProp='p' fontVariant='small'>Ape {`#143${index}`}</Typography>
      </MemberDescription>
      {winnerTag()}
    </MemberRow>
  )
}
