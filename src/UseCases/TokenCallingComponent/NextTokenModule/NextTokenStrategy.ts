import Feature from '../Feature';

export default interface{
  features: Feature[];
  callNextToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}