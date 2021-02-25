import Token from '../../Entities/TokenCore/Token';
import Operator from '../../Entities/UserCore/Operator';

enum TokenStatus{
    CALLAGAIN = "CallAgain",
    BYPASS = "ByPass",
    FORWARD = " Forward",
    UNPROCESSED = "Unprocessed"
}

class TokenProcessing{
    private _operator: Operator;
    private _status: TokenStatus;
    private _timeStamp: Date;
    
    public set operator(operator: Operator){
        this._operator = operator;
    }
    
    public set status(status: TokenStatus){
        this._status = status;
    }
    
    public set timeStamp (timeStamp: Date){
        this._timeStamp = timeStamp;
    }
    
    public getTokenProcessingObject(){
        return {
            operator: this._operator,
            status: this._status,
            timestamp: this._timeStamp
        };
    }
    
}

class TokenbaseObject{
    private _token: Token;
    private tokenProcessingInfo: TokenProcessing[] = [];
    
    public setToken(token: Token){
        this._token = token;
    } 

    public addTokenProcessingInfo(tokenProcessing: TokenProcessing){
        this.tokenProcessingInfo.push(tokenProcessing);
    }
}

export {TokenStatus, TokenProcessing, TokenbaseObject};