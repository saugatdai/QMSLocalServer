import Token from '../../../Entities/TokenCore/Token';
import Feature from '../Feature';

export default interface TokenForwardStrategy {
  features: Feature[];
  forwardToken: (handledToken: Token) => Promise<Token>;
  pipeFeature: (feature: Feature) => void;
}
