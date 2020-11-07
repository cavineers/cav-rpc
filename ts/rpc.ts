import { Client as DRPC } from "discord-rpc";
import EventEmitter from "events";

export default class RPC extends EventEmitter {
    private client: DRPC;
    private clientId: string = "518144885849718784";
    private secret: string = "2xl2VAUCfeNnBu__nm5xWkPmPw3Tn2ze";
    private scopes: string[] = ["guilds"];
    private state: string = "";
    private txt: string = "";
    private img: string = "";
    private timestamp: Date = new Date();
    private process: any;

    constructor() {
        super();
        this.client = new DRPC({ transport: "ipc" });

        this.client.on("ready", () => {
            //@ts-expect-error
            console.log(`Connected to ${this.client.user.username} through ${this.client.clientId}`);
        });

        this.client
            .login({ clientId: this.clientId, clientSecret: this.secret })
            .then(() => {
                // console.log(this.client.accessToken);
                // this.client
                //     .getGuild("578394134314876928", 5000)
                //     .then(console.log)
                //     .catch((e) => {
                //         console.log("error", e);
                //     });
            })
            .catch((e) => {
                this.emit("error", e);
            });

        this.on("change", () => {
            this.timestamp = new Date();
        });
    }

    public enable(): boolean {
        if (this.client.user?.id != undefined) {
            if (this.state.length > 2 && this.txt.length > 2 && this.img.length > 2) {
                this.process = setInterval(() => {
                    this.setActivity();
                }, 30000);
                this.setActivity();
                this.emit("enabled");
                return true;
            }
        } else {
            console.log("undefined");
            this.client
                .login({ clientId: this.clientId, clientSecret: this.secret })
                .then(() => {
                    this.enable();
                })
                .catch((e) => {
                    this.emit("error", e);
                });
        }
        return false;
    }

    public disable(): void {
        clearInterval(this.process);
        this.client.clearActivity();
        this.emit("disabled");
    }

    public setImage(img: string) {
        this.img = img;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }

    public setText(txt: string) {
        this.txt = txt;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }

    public setState(txt: string): void {
        this.state = txt;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }

    private setActivity(): void {
        this.client.setActivity({
            details: this.txt,
            state: this.state,
            startTimestamp: this.timestamp,
            largeImageKey: this.img,
            smallImageKey: "4541-logo",
            smallImageText: "4541 Cavineers",
            instance: false,
        });
    }
}
