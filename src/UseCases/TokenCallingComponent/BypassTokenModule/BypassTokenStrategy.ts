import Feature from '../Feature';
import Token from "../../../Entities/TokenCore/Token";

export default interface BypassTokenStrategy {
  features: Feature[];
  bypassToken: (handledToken: Token) => Promise<Token>;
  pipeFeature: (feature: Feature) => void;
}
