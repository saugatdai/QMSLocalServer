import Feature from '../Feature';

export default interface NextTokenStrategy {
  features: Feature[];
  callNextToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}