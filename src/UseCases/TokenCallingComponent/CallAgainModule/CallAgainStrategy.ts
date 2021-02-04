import Feature from '../Feature';

export default interface CallAgainStrategy {
  features: Feature[];
  callAgainToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}
