import "core-js/fn/promise";
export default class SharedWebsocket {
    url: string;
    protocols?: string[] | undefined;
    private _onclose;
    private _onerror;
    private _onmessage;
    private _onopen;
    private WEBSOCKET_COMMUNICATION_KEY;
    private WEBSOCKET_MASTER_KEY;
    private isMaster;
    private _isMasterAlive;
    private uuid;
    private _websocket;
    private destroyed;
    private alone;
    constructor(url: string, protocols?: string[] | undefined);
    send(data: any): void;
    close(): void;
    setUp(): Promise<void>;
    fightToBeMaster(): Promise<boolean>;
    setEvents(): void;
    handleStorageEvents(event: any): void;
    answerIsMasterAlive(): void;
    handleCommunication(msg: object | any): void;
    destroy(): void;
    broadcast(msg: object | any): void;
    isMasterAlive(): Promise<boolean>;
    setMaster(): void;
    onclose: Function;
    onerror: Function;
    onmessage: Function;
    onopen: Function;
}
declare global {
    interface Window {
        SharedWebsocket: any;
    }
}
