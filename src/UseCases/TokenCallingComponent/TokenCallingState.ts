import Operator from "../../Entities/UserCore/Operator";

type TokenCallingState = {
  category: string;
  tokenNumber: number;
  operator: Operator,
  completion: boolean
}

export default TokenCallingState;