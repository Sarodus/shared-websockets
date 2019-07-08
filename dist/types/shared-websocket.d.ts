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
    constructor(url: string, protocols?: string[] | undefined);
    send(data: any): void;
    close(): void;
    setUp(): Promise<void>;
    setEvents(): void;
    handleStorageEvents(event: any): void;
    answerIsMasterAlive(): void;
    handleCommunication(msg: object | any): void;
    destroy(): void;
    broadcast(msg: object): void;
    isMasterAlive(): Promise<any>;
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
