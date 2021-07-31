import Token from '../../Entities/TokenCore/Token';
import Operator from '../../Entities/UserCore/Operator';

enum TokenStatus {
    CALLAGAIN = "CallAgain",
    BYPASS = "ByPass",
    FORWARD = " Forward",
    UNPROCESSED = "Unprocessed",
    PROCESSED = "Processed",
    ASSIGNED = "Assigned",
    RANDOMPROCESSED = "RandomlyProcessed"
}

class TokenProcessing {
    private _operator: Operator;
    private _status: TokenStatus;
    private _timeStamp: Date;

    public set operator(operator: Operator) {
        this._operator = operator;
    }

    public set status(status: TokenStatus) {
        this._status = status;
    }

    public get status() {
        return this._status;
    }

    public set timeStamp(timeStamp: Date) {
        this._timeStamp = timeStamp;
    }

    public getTokenProcessingObject() {
        return {
            operator: this._operator,
            status: this._status,
            timestamp: this._timeStamp
        };
    }
}

class TokenBaseObject {
    private _currentStatus: TokenStatus = TokenStatus.UNPROCESSED;
    private tokenProcessingInfo: TokenProcessing[] = [];

    constructor(private _token: Token) { }

    public set token(token: Token) {
        this._token = token;
    }

    public get token() {
        return this._token;
    }

    public addTokenProcessingInfo(tokenProcessing: TokenProcessing) {
        this.tokenProcessingInfo.push(tokenProcessing);
        this.currentStatus = tokenProcessing.status;
    }

    public set currentStatus(currentStatus: TokenStatus) {
        this._currentStatus = currentStatus;
    }

    public get currentStatus() {
        return this._currentStatus;
    }

    public getBaseObjectDetails() {
        return {
            token: this._token,
            tokenProcessingInfo: this.tokenProcessingInfo.map(tokenProcessing => tokenProcessing.getTokenProcessingObject())
        }
    }
}

export { TokenStatus, TokenProcessing, TokenBaseObject };