// Import
const { ipcRenderer } = require("electron");
const Store = require("electron-store");
const schema = require("./db.schema.json");
const RPC = require("./js/rpc.js");

const store = new Store({ schema: schema, fileExtension: "db", clearInvalidConfig: true, serialize: false, accessPropertiesByDotNotation: true });
const rpc = new RPC();

ipcRenderer.on("update_status", (e, args) => {
    let a = document.getElementById("main");
    let b = document.getElementById("boot");

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
            b.style.display = "none";
            a.style.display = "block";
            if (!store.has("firstBoot")) {
                store.set("firstBoot", false);
            }
            M.Sidenav.init(document.getElementById("sn"), { edge: "right" });
            // M.Sidenav.getInstance(document.getElementById("sn")).open();
            M.FormSelect.init(document.querySelectorAll("select"));
            document.getElementById("close-nav").addEventListener("click", () => {
                M.Sidenav.getInstance(document.getElementById("sn")).close();
            });
            document.getElementById("e").addEventListener("change", () => {
                console.log(document.getElementById("e").checked);
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
});
