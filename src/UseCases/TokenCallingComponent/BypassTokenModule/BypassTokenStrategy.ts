import Feature from '../Feature';

export default interface BypassTokenStrategy {
  features: Feature[];
  bypassToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}
