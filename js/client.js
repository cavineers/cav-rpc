const { ipcRenderer } = require("electron");

ipcRenderer.on("update_status", (e, args) => {
    console.log(args);

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
