declare const EventEmitter: any;
export default class RPC extends EventEmitter {
    private client;
    private clientId;
    private secret;
    private scopes;
    private state;
    private txt;
    private img;
    private timestamp;
    private process;
    constructor();
    enable(): boolean;
    disable(): void;
    setImage(img: string): void;
    setText(txt: string): void;
    setState(txt: string): void;
    private setActivity;
}
export {};
