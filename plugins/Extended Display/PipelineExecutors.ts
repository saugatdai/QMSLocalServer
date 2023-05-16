import PipelineTypes from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineTypes';
import PipelineExecutor from '../../src/UseCases/PluginManagementComponent/PluginModule/PipelineExecutor';
import Feature from '../../src/UseCases/TokenCallingComponent/Feature';
import TokenCallingState from '../../src/UseCases/TokenCallingComponent/TokenCallingState';

import { updateScreen, RowInfo } from './Helpers/preload';

const addTokenToDisplay: Feature = {
    runFeature: (tokenCallingState: TokenCallingState) => {
        if (tokenCallingState.nextToken) {
            const tokenCateogry = tokenCallingState.nextToken.tokenCategory;
            const tokenNumber = tokenCallingState.nextToken.tokenNumber;

            const counter = tokenCallingState.operator.getUserInfo().counter;

            const rowInfo: RowInfo = {
                counter,
                tokenNo: tokenCateogry ? `${tokenCateogry}${tokenNumber}` : `${tokenNumber}`
            }
            updateScreen(rowInfo);
        }
    },
    goToNextFeature: true
}

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

const callNextDisplayPipeline = new PipelineExecutorClass(PipelineTypes.CALL_NEXT_TOKEN);
const callAgainDisplayPipeline = new PipelineExecutorClass(PipelineTypes.CALL_AGAIN_TOKEN);
const bypassPipeline = new PipelineExecutorClass(PipelineTypes.BYPASS_TOKEN);
const randomCallPipeline = new PipelineExecutorClass(PipelineTypes.RANDOM_CALL);
const tokenForwardPipeline = new PipelineExecutorClass(PipelineTypes.FORWARD_TOKEN);

callNextDisplayPipeline.addFeature(addTokenToDisplay);
callAgainDisplayPipeline.addFeature(addTokenToDisplay);
bypassPipeline.addFeature(addTokenToDisplay);
randomCallPipeline.addFeature(addTokenToDisplay);
tokenForwardPipeline.addFeature(addTokenToDisplay);

export { callNextDisplayPipeline, callAgainDisplayPipeline, bypassPipeline, randomCallPipeline, tokenForwardPipeline };