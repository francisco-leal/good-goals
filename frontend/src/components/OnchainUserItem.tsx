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
import GoalsABI from "@/lib/abi/Goals.json";
import { SMART_CONTRACT_ADDRESS } from "@/lib/constants";
import { toast } from 'react-toastify';

type Props = {
  name: string,
  groupExists: boolean,
  numberOfMembers: number,
  step: string,
  index: number
}

const DEFAULT_IMAGE = "https://ipfs.io/ipfs/bafybeigauplro2r3fyn5443z55dp2ze5mc5twl5jqeiurulyrnociqynkq/male-2-8-15-10-8-2-11-9.png";

type MemberInfo = {
  goalDescription: "the very best",
  goalTitle: "Be the best",
  source: "0x33041027dd8F4dC82B6e825FB37ADf8f15d44053",
  stake: 100000000000000000n
}

export function OnchainUserItem({name, groupExists, numberOfMembers, step, index}: Props) {
  const { data: memberInfo, isLoading: membersLoading }: {data?: MemberInfo, isLoading: boolean} = useContractRead({
    address: SMART_CONTRACT_ADDRESS,
    abi: GoalsABI,
    functionName: "getMemberOfGroupByIndex",
    args: [name, index],
    enabled: (!!name && !!groupExists && numberOfMembers > 0)
  });


  const approve = () => {
    toast.success("Approved!");
  }

  const reject = () => {
    toast.error("Approved!");
  }

  const viewProof = () => {

  };

  console.log({memberInfo, membersLoading});

  const renderListActions = () => {
    switch(step) {
      case "submit":
        return <Tag className="ml-auto" colorStyle="blueSecondary">Waiting for proof</Tag>
      case "distribute":
        return <>
          <Button colorStyle='transparent' shape="square" className='ml-auto'>
            <MagnifyingGlassSVG />
          </Button>
          <Button colorStyle='greenSecondary' shape="square" onClick={() => approve()}>
            <CheckSVG />
          </Button>
          <Button colorStyle='redSecondary' shape="square" onClick={() => approve()}>
            <CrossSVG />
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
        <Typography asProp='p' fontVariant='body'>leal.eth</Typography>
        <Typography asProp='p' fontVariant='small'>{memberInfo?.goalTitle}</Typography>
      </MemberDescription>
      {renderListActions()}
    </MemberRow>
  )
}
