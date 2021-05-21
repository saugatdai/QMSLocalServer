export interface Feature {
  runFeature: () => void;
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
}
