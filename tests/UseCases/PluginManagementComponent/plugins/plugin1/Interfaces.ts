export interface Feature{
    runFeature : () => void;
};

export interface EventHandler{
    eventType: string;
    handleEvent: () => void;
};

export interface PipelineExecutors{
    features: Feature[];
    pipelineType: string;
    addFeature: (feature: Feature) => void;
}

export interface Plugin{
    EventHandlers: EventHandler[];
}
