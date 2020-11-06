// Import
import { IpcRendererEvent } from "electron";
import Store from "electron-store";
import * as fs from "fs";
import * as Path from "path";
import RPC from "./rpc";

export default class Client {
    private schema = JSON.parse(fs.readFileSync(Path.join(__dirname, "..", "db.schema.json"), "utf-8"));
    private rpc: RPC = new RPC();
    private store: Store = new Store({ schema: this.schema, fileExtension: "db", clearInvalidConfig: true, accessPropertiesByDotNotation: true });

    public updateStatus(e: IpcRendererEvent, args: any) {
        let a: HTMLDivElement = <HTMLDivElement>document.getElementById("main");
        let b: HTMLDivElement = <HTMLDivElement>document.getElementById("boot");

        switch (args.code) {
            case -1:
                console.error(args.error);
                b.innerText = args.text;
                break;
            case 0:
                b.innerText = args.text;
                break;
            case 1:
                b.innerText = args.text;
                break;
            case 2:
                b.innerText = args.text;
                // b.style.display = "none";
                // a.style.display = "block";
                if (this.store?.has("firstBoot")) {
                    this.store.set("firstBoot", false);
                }
                if (this.store.has("top")) {
                    (<HTMLInputElement>document.getElementById("text")).value = <string>this.store.get("top");
                    (<HTMLInputElement>document.getElementById("text2")).value = <string>this.store.get("bottom");
                    (<HTMLInputElement>document.getElementById("img")).value = <string>this.store.get("image");
                    M.updateTextFields();
                    this.rpc.setText((<HTMLInputElement>document.getElementById("text")).value);
                    this.rpc.setState((<HTMLInputElement>document.getElementById("text2")).value);
                    this.rpc.setImage((<HTMLInputElement>document.getElementById("img")).value);
                }
                M.Sidenav.init(<HTMLDivElement>document.getElementById("sn"), { edge: "right" });
                // M.Sidenav.getInstance(document.getElementById("sn")).open();
                M.FormSelect.init(document.querySelectorAll("select"));
                (<HTMLLIElement>document.getElementById("close-nav")).addEventListener("click", () => {
                    M.Sidenav.getInstance(<HTMLLIElement>document.getElementById("sn")).close();
                });
                (<HTMLInputElement>document.getElementById("e")).addEventListener("change", () => {
                    if ((<HTMLInputElement>document.getElementById("e")).checked) {
                        if (this.rpc.enable()) {
                            (<HTMLDivElement>document.getElementById("nb")).className = "green";
                            (<HTMLDivElement>document.getElementById("nbt")).innerText = "Connected";
                            return;
                        }
                    }
                    this.rpc.disable();
                    (<HTMLDivElement>document.getElementById("nb")).className = "red";
                    (<HTMLDivElement>document.getElementById("nbt")).innerText = "Disconnected";
                    (<HTMLInputElement>document.getElementById("e")).checked = false;
                });
                (<HTMLButtonElement>document.getElementById("update")).addEventListener("click", () => {
                    if ((<HTMLInputElement>document.getElementById("text")).value == "" || (<HTMLInputElement>document.getElementById("text2")).value == "" || (<HTMLInputElement>document.getElementById("img")).value == "") {
                        (<HTMLInputElement>document.getElementById("e")).checked = false;
                    } else {
                        this.rpc.setText((<HTMLInputElement>document.getElementById("text")).value);
                        this.rpc.setState((<HTMLInputElement>document.getElementById("text2")).value);
                        this.rpc.setImage((<HTMLInputElement>document.getElementById("img")).value);
                        this.store.set("top", (<HTMLInputElement>document.getElementById("text")).value);
                        this.store.set("bottom", (<HTMLInputElement>document.getElementById("text2")).value);
                        this.store.set("image", (<HTMLInputElement>document.getElementById("img")).value);
                    }
                });
                break;
            case 3:
                b.innerHTML = `<div class="progress"><div class="determinate red" style="width: ${args.percent}%"></div></div><div style="text-align:center;" class="grey-text">${args.current}/${args.total}</div>`;
                break;
            case 4:
                b.innerHTML = `<div class="progress"><div class="indeterminate red"></div></div>`;
                break;
            default:
                console.warn("Unknown status_update status code");
                break;
        }
    }
}
