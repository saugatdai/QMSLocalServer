import TokenCallingState from "./TokenCallingState";

export default interface feature {
  goToNextFeature?: boolean;
  runFeature: (tokenCallingState?: TokenCallingState) => void;
}