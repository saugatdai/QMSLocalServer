import Token from '../../../Entities/TokenCore/Token';
import Feature from '../Feature';

export default interface RandomTokenCallStrategy {
  features: Feature[];
  callRandomToken: (handledToken: Token) => Promise<Token>;
  pipeFeature: (feature: Feature) => void;
}
