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
}

export interface Plugin {
  EventHandlers: EventHandler[];
  pipelineExecutors: PipelineExecutor[];
  priority: number;
}
