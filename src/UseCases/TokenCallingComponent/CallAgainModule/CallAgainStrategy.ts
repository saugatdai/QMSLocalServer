import Token from '../../../Entities/TokenCore/Token';
import Feature from '../Feature';

export default interface CallAgainStrategy {
  features: Feature[];
  callAgainToken: (handledToken: Token) => Promise<Token>;
  pipeFeature: (feature: Feature) => void;
}
