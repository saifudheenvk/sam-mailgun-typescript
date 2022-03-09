export interface IWebHookPayLoad {
    signature: ISignature;
    'event-data': IEventData
}

export interface IEventData {
    id: string;
    timestamp: number;
    event: string;
    'log-level': string;
    'delivery-status': object;
    flags: object;
    envelope: object;
    message: object;
    recipient: string;
    'recipient-domain': string;
    storage: string;
    campaigns: Array<any>;
    tags: Array<string>;
    'user-variables': object;
}

export interface ISignature {
    token: string;
    timestamp: string;
    signature: string;
}

