import { IpcRendererEvent } from "electron";
export default class Client {
    private schema;
    private rpc;
    private store;
    updateStatus(e: IpcRendererEvent, args: any): void;
}
