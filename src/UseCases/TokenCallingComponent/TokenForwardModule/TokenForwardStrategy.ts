import Feature from '../Feature';

export default interface TokenForwardStrategy {
  features: Feature[];
  forwardToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}
