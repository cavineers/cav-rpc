"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_store_1 = __importDefault(require("electron-store"));
const fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const rpc_1 = __importDefault(require("./rpc"));
class Client {
    constructor() {
        this.schema = JSON.parse(fs.readFileSync(Path.join(__dirname, "..", "db.schema.json"), "utf-8"));
        this.rpc = new rpc_1.default();
        this.store = new electron_store_1.default({ schema: this.schema, fileExtension: "db", clearInvalidConfig: true, accessPropertiesByDotNotation: true });
        console.log("Copyright © 2020 FRC Team 4541");
        console.log(`Version: v${require("electron").remote.app.getVersion()}`);
    }
    updateStatus(e, args) {
        var _a;
        let a = document.getElementById("main");
        let b = document.getElementById("boot-text");
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
                // Set public text
                b.innerText = args.text;
                // Check if this is the first time booting up
                if ((_a = this.store) === null || _a === void 0 ? void 0 : _a.has("firstBoot")) {
                    this.store.set("firstBoot", false);
                }
                // Restore past session data
                if (this.store.has("top")) {
                    // Set values
                    document.getElementById("text").value = this.store.get("top");
                    document.getElementById("text2").value = this.store.get("bottom");
                    document.getElementById("img").value = this.store.get("image");
                    // Pass to RPC
                    this.rpc.setText(document.getElementById("text").value);
                    this.rpc.setState(document.getElementById("text2").value);
                    this.rpc.setImage(document.getElementById("img").value);
                }
                // Restore current branch data
                if (this.store.has("branch")) {
                    // Set value
                    document.getElementById("branch").value = this.store.get("branch");
                }
                // Settings close listener
                document.getElementById("close-nav").addEventListener("click", () => {
                    // Get instance and close
                    M.Sidenav.getInstance(document.getElementById("sn")).close();
                });
                // Enable/Disable toggle listener
                document.getElementById("e").addEventListener("change", () => {
                    if (document.getElementById("e").checked) {
                        if (this.rpc.enable()) {
                            document.getElementById("nb").className = "green";
                            document.getElementById("nbt").innerText = "Connected";
                            return;
                        }
                    }
                    this.rpc.disable();
                    document.getElementById("nb").className = "red";
                    document.getElementById("nbt").innerText = "Disconnected";
                    document.getElementById("e").checked = false;
                });
                // Update fields listener
                document.getElementById("update").addEventListener("click", () => {
                    if (document.getElementById("text").value == "" || document.getElementById("text2").value == "" || document.getElementById("img").value == "") {
                        document.getElementById("e").checked = false;
                    }
                    else {
                        // Set RPC
                        this.rpc.setText(document.getElementById("text").value);
                        this.rpc.setState(document.getElementById("text2").value);
                        this.rpc.setImage(document.getElementById("img").value);
                        // Save to persistent
                        this.store.set("top", document.getElementById("text").value);
                        this.store.set("bottom", document.getElementById("text2").value);
                        this.store.set("image", document.getElementById("img").value);
                    }
                });
                // Branch update listener
                document.getElementById("branch").addEventListener("change", () => {
                    console.log(document.getElementById("branch").value);
                    this.store.set("branch", document.getElementById("branch").value);
                });
                // Set version info
                document.getElementById("v").innerText = require("electron").remote.app.getVersion();
                // Initialize the settings menu
                M.Sidenav.init(document.getElementById("sn"), { edge: "right" });
                // Initialize selects
                M.FormSelect.init(document.querySelectorAll("select"));
                // Update text fields
                M.updateTextFields();
                // Switch display to main
                document.getElementById("boot").style.display = "none";
                a.style.display = "block";
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
exports.default = Client;
