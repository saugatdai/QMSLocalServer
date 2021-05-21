export interface Feature {
  runFeature: () => void;
  goToNextFeature: boolean;
}

export interface EventHandler {
  eventType: string;
  handleEvent: () => void;
}

export interface PipelineExecutor {
  features: Feature[];
  pipelineType: string;
  addFeature: (feature: Feature) => void;
}

export interface Plugin {
  eventHandlers: EventHandler[];
  pipelineExecutors: PipelineExecutor[];
  priority: number;
  callAgainStrategy?: CallAgainStrategy;
  bypassStrategy?: BypassTokenStrategy;
  nextTokenStrategy?: NextTokenStrategy;
  randomCallStrategy?: RandomTokenCallStrategy;
  tokenForwardStrategy?: TokenForwardStrategy;
}

export interface BypassTokenStrategy {
  features: Feature[];
  bypassToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}

export interface CallAgainStrategy {
  features: Feature[];
  callAgainToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}

export interface NextTokenStrategy {
  features: Feature[];
  callNextToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}

export interface RandomTokenCallStrategy {
  features: Feature[];
  callRandomToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}

export interface TokenForwardStrategy {
  features: Feature[];
  forwardToken: (tokenNumber: number) => void;
  pipeFeature: (feature: Feature) => void;
}