import Feature from '../Feature';

export default interface RandomTokenCallStrategy {
  features: Feature[];
  callRandomToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}
