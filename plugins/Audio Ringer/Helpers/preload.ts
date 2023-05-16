import EventManagerSingleton from '../../../src/UseCases/EventManagementComponent/EventManagerSingleton';
import { constants } from './constants';

import * as path from 'path';

import TokenCallingState from '../../../src/UseCases/TokenCallingComponent/TokenCallingState';
import TokenCallingStateManagerSingleton from '../../../src/UseCases/TokenCallingComponent/TokenCallingStateManagerSingleton';

export default class AudioRingerSingleton {
  private static instance = new AudioRingerSingleton();

  private isPlaying: boolean;
  private tokenCallingStates: TokenCallingState[] = [];

  private constructor() {
    this.isPlaying = false;
  }

  public static getInstance() {
    return this.instance;
  }

  public isAudioPlaying() {
    return this.isPlaying;
  }

  public addToTokenCallingStates(tokenCallingState: TokenCallingState) {
    this.tokenCallingStates.push(tokenCallingState);
  }

  public getAudioTracksForTokenCallingState(tokenCallingState: TokenCallingState) {
    let tokenCategory: string = tokenCallingState.nextToken.tokenCategory;;
    let tokenNumber: number = tokenCallingState.nextToken.tokenNumber;;
    const counter = tokenCallingState.operator.getCounter().toUpperCase();

    const defaultAudioFolder = path.join(__dirname, '../audios/audio_default');
    const nepaliAudioFolder = path.join(__dirname, '../audios/audio_nepali');

    const thousand = parseInt((tokenNumber / 1000).toString()) * 1000;
    tokenNumber = tokenNumber % 1000;
    const hundred = parseInt((tokenNumber / 100).toString()) * 100;
    tokenNumber = tokenNumber % 100;


    const tracks: string[] = [`${defaultAudioFolder}/dingdong.wav`];
    tracks.push(`${nepaliAudioFolder}/token_no.wav`);
    tokenCategory && tracks.push(`${nepaliAudioFolder}/${tokenCategory.toUpperCase()}.wav`);
    thousand && tracks.push(`${nepaliAudioFolder}/${thousand.toString()}.wav`);
    hundred && tracks.push(`${nepaliAudioFolder}/${hundred.toString()}.wav`);
    tokenNumber && tracks.push(`${nepaliAudioFolder}/${tokenNumber.toString()}.wav`);

    tracks.push(`${nepaliAudioFolder}/counter_no.wav`);
    tracks.push(`${nepaliAudioFolder}/${counter}.wav`);
    tracks.push(`${nepaliAudioFolder}/MaJanuhola.wav`)

    return tracks;
  }

  public playAudioTrackForTokenCallingState(tokenCallingState: TokenCallingState) {
    const tracks = this.getAudioTracksForTokenCallingState(tokenCallingState);

    const audio = new Audio(tracks[0]);
    audio.src = tracks[0];
    audio.play();

    this.isPlaying = true;

    let index = 1;
    audio.onended = () => {
      if (index < tracks.length) {
        audio.src = tracks[index];
        audio.play();
        index++;
      } else {
        const operator = tokenCallingState.operator.getUserInfo().username;
        TokenCallingStateManagerSingleton.getInstance().removeStateLockerForOperatorCallingState(operator, constants.LOCKER_NAME);
        this.isPlaying = false;
        EventManagerSingleton.getInstance().emit(constants.START_AUDIO_PLAY);
      }
    }
  }

  public beginAudioPlay() {
    const tokenCallingStateToBePlayed = this.tokenCallingStates.shift();
    if (tokenCallingStateToBePlayed) {
      this.playAudioTrackForTokenCallingState(tokenCallingStateToBePlayed);
    } else {
      return;
    }
  }
}



EventManagerSingleton.getInstance().on(constants.START_AUDIO_PLAY, () => {
  if (AudioRingerSingleton.getInstance().isAudioPlaying()) {
    return;
  } else {
    AudioRingerSingleton.getInstance().beginAudioPlay();
  }
});