const DRPC = require("discord-rpc");
const EventEmitter = require("events");

class RPC extends EventEmitter {
    client;
    clientId = "518144885849718784";
    secret = "2xl2VAUCfeNnBu__nm5xWkPmPw3Tn2ze";
    scopes = ["guilds"];
    redirectUri = "http://localhost:3119";
    txt = "";
    img = "";

    constructor() {
        super();
        this.client = new DRPC.Client({ transport: "ipc" });

        this.client.on("ready", () => {
            console.log(this.client);
            console.log(`Connected to ${this.client.user.username} through ${this.client.clientId}`);
        });

        this.client
            .login({ clientId: this.clientId, clientSecret: this.secret, scopes: this.scopes, redirectUri: this.redirectUri })
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
    }

    enable() {
        this.emit("enabled");
    }

    disable() {
        this.client.clearActivity();
        this.emit("disabled");
    }

    setImage(img) {
        this.img = img;
        this.emit("changed", { txt, img });
    }

    setText(txt) {
        this.txt = txt;
        this.emit("changed", { txt, img });
    }

    setActivity() {}
}

module.exports = RPC;
