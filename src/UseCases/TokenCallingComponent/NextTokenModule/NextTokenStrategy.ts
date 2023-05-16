import Token from '../../../Entities/TokenCore/Token';
import Feature from '../Feature';

export default interface NextTokenStrategy {
  features: Feature[];
  callNextToken: (handledToken: Token) => Promise<Token>;
  pipeFeature: (feature: Feature) => void;
}