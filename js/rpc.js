"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_rpc_1 = require("discord-rpc");
const events_1 = __importDefault(require("events"));
class RPC extends events_1.default {
    constructor() {
        super();
        this.clientId = "518144885849718784";
        this.secret = "2xl2VAUCfeNnBu__nm5xWkPmPw3Tn2ze";
        this.scopes = ["guilds"];
        this.state = "";
        this.txt = "";
        this.img = "";
        this.timestamp = new Date();
        this.client = new discord_rpc_1.Client({ transport: "ipc" });
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
    enable() {
        var _a;
        if (((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.id) != undefined) {
            if (this.state.length > 2 && this.txt.length > 2 && this.img.length > 2) {
                this.process = setInterval(() => {
                    this.setActivity();
                }, 30000);
                this.setActivity();
                this.emit("enabled");
                return true;
            }
        }
        else {
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
    disable() {
        clearInterval(this.process);
        this.client.clearActivity();
        this.emit("disabled");
    }
    setImage(img) {
        this.img = img;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }
    setText(txt) {
        this.txt = txt;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }
    setState(txt) {
        this.state = txt;
        this.emit("changed", { top: this.txt, btm: this.state, img: this.img });
    }
    setActivity() {
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
exports.default = RPC;
