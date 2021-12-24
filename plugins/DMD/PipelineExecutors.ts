import mqtt from 'mqtt';

import PipelineTypes from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineTypes';
import PipelineExecutor from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineExecutor';
import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import TokenCallingState from '../../src/UseCases/TokenCallingComponent/TokenCallingState';

const client = mqtt.connect('mqtt://127.0.0.1:1883', {
    clientId: "dmdPlugin",
    username: "saugatdai",
    password: "NamahShivaya:-)"
});

let feature: Feature = {
    runFeature: (tokenCallingState: TokenCallingState) => {
        if (tokenCallingState.nextToken) {
            const toPublish = {
                tokenNumber: tokenCallingState.nextToken.tokenNumber.toString(),
                tokenCategory: tokenCallingState.nextToken.tokenCategory,
                counter: tokenCallingState.operator.getCounter().toString()
            }

            client.publish("dmd", JSON.stringify(toPublish));
        }
    },
    goToNextFeature: true
}

client.on('connect', () => {
    console.log('MQTT Client DMD Plugin Connected successfully to broker');
});

class PipelineExecutorClass implements PipelineExecutor {
    public features: Feature[] = [];
    public pipelineType: PipelineTypes;
    constructor(pipelineType: PipelineTypes) {
        this.pipelineType = pipelineType;
    }

    public addFeature(feature: Feature): void {
        this.features.push(feature);
    }
}

const callNextDmdPipeline = new PipelineExecutorClass(PipelineTypes.CALL_NEXT_TOKEN);
const callAgainDmdPipeline = new PipelineExecutorClass(PipelineTypes.CALL_AGAIN_TOKEN);
const bypassDmdPipeline = new PipelineExecutorClass(PipelineTypes.BYPASS_TOKEN);
const randomCallDmdPipeline = new PipelineExecutorClass(PipelineTypes.RANDOM_CALL);
const tokenForwardDmdPipeline = new PipelineExecutorClass(PipelineTypes.FORWARD_TOKEN);

callNextDmdPipeline.addFeature(feature);
callAgainDmdPipeline.addFeature(feature);
bypassDmdPipeline.addFeature(feature);
randomCallDmdPipeline.addFeature(feature);
tokenForwardDmdPipeline.addFeature(feature);

export { callNextDmdPipeline, callAgainDmdPipeline, bypassDmdPipeline, randomCallDmdPipeline, tokenForwardDmdPipeline };