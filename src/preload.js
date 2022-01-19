const {contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("IPC", {
    send: (channel, ...data) => {
        ipcRenderer.send(channel, ...data);
    }, receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
});
