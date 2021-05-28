"use strict";
import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { scriptModel } from "./schemas/scriptSchema";
import { resultModel } from "./schemas/resultSchema";

const isDevelopment = process.env.NODE_ENV !== "production";

const path = require('path')
const fs = require('fs')
const cp = require('child_process')
const mongoose = require('mongoose')

require('@electron/remote/main').initialize()

let pathToCpp

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

let forceQuit = false
const admin = {
    login: 'admin',
    password: 'admin'
}

let win;

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1300,
        height: 800,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true
        },
    });

    win.on('close', e => {
        console.log(forceQuit)
        if (!forceQuit) e.preventDefault()

        dialog.showMessageBox(win, {
            type: 'question',
            buttons: ['Yes', 'No'],
            title: 'Confirm',
            message: 'Are you sure you want to close this?'
        }).then(({response}) => {
            if (response === 0) {
                forceQuit = true
                win.close()
            }
        })

    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        pathToCpp = path.join(__dirname, '../src', 'assets', 'cpp', 'index.exe')
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        await win.loadURL("app://./index.html");
        pathToCpp = "app://./cpp/index.exe"
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) await createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    await createWindow();

    mongoose.connect(
        'mongodb+srv://Furamy:pass123@cluster0.buzs6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        { useUnifiedTopology: true }
    ).then(() => {
        console.log('Connected to mongoDB!')
    })
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

ipcMain.handle('admin:login', (ev, data) => {
    return data.login === admin.login && data.password === admin.password
})

let isClosed = false

ipcMain.handle('check:closed', async () => {
    return isClosed
})

ipcMain.handle('win:show', () => {
    console.log('win:show')
    win.show()
})
ipcMain.handle('win:hide', () => {
    console.log('win:hide')
    win.hide()
})

ipcMain.handle('start', async (ev, data) => {
    const script = await scriptModel.findOne({ id: data.scriptId })
    let mainData = {
        name: data.name,
        time: script.time,
        scriptId: script.id,
        script: script.script
    }
    isClosed = false
    execute(mainData)
});

function execute(data) {
    console.log('Data:', data)
    console.log(__dirname)
    cp.exec(pathToCpp, (err) => {
        if (err) console.log('closed')
    })

    // win.hide()
    const timeout = setTimeout(() => {
        clearInterval(interval)
        // win.show()
        cp.exec('taskkill /IM index.exe /F')
        isClosed = true
    }, data.time)
    const interval = setInterval(() => {
        fs.readFile(path.join(__dirname, '..', 'keylog.txt'), "utf8", async (err, text) => {
            if (err) throw err
            const match = text.match(new RegExp(data.script))

            if (match) {
                let out = text.slice(0, match.index) + match[0]
                let id = 0
                let results = await resultModel.find()
                if (results[0]) {
                    results.forEach(el => {
                        if (el.id > id) id = el.id
                    })
                }

                if (results.find(el => el.name === data.name && el.scriptId === data.scriptId)) {
                    const user = await resultModel.findOne({ name: data.name, scriptId: data.scriptId })
                    await resultModel.findOneAndUpdate({ name: data.name, scriptId: data.scriptId }, { lastEnter: out, tries: user.tries + 1 }).exec()
                    clearTimeout(timeout)
                    clearInterval(interval)
                    // win.show()
                    cp.exec('taskkill /IM index.exe /F')
                    isClosed = true
                    return
                }

                const result = new resultModel({
                    _id: new mongoose.Types.ObjectId(),
                    id: id + 1,
                    name: data.name,
                    scriptId: data.scriptId,
                    lastEnter: out,
                    tries: 1
                })

                await result.save()

                clearTimeout(timeout)
                clearInterval(interval)
                // win.show()
                cp.exec('taskkill /IM index.exe /F')
                isClosed = true
            }
        });
    },1000)
}

ipcMain.handle('save-scripts', async (ev, scripts) => {
    await scriptModel.deleteMany()
    console.log(scripts)

    for (const el of scripts) {
        let time = el.time.split(':')
        if (time.length === 2) time = (Number(time[0]) * 60 + Number(time[1])) * 1000
        if (time.length === 1) time = time[0]
        const script = new scriptModel({
            _id: new mongoose.Types.ObjectId(),
            id: el.id,
            script: el.script,
            time: time
        })

        await script.save()
    }


    let result = await scriptModel.find()
    console.log('Result:', result)
    return true
})

ipcMain.handle('get-scripts', async () => {
    const scripts = await scriptModel.find()
    return JSON.stringify(scripts)
})

ipcMain.handle('find-result',  async (ev, name, scriptId) => {
    const { lastEnter } = await resultModel.findOne({ scriptId: scriptId, name: name })
    const { script } = await scriptModel.findOne({ id: scriptId })
    if (lastEnter || lastEnter === '' && script) return JSON.stringify([lastEnter, script])
    return null
})

ipcMain.handle('get-results', async () => {
    return JSON.stringify(await resultModel.find())
})

ipcMain.handle('delete-result', async (ev, result) => {
    return resultModel.findByIdAndRemove(result._id)
})


ipcMain.handle('test:t', () => {
    console.log('interval tick')
})

const pathToConvertFile = path.join(__dirname, 'bundled', 'convertToPdf.js')

ipcMain.handle('download-results', async () => {
    const path = await dialog.showOpenDialog({
        properties: ['openDirectory']
    })
    console.log('path', path)
    if (path.canceled) return null
    cp.exec(`node ${pathToConvertFile} ${path.filePaths}`, (err, out) => {
        console.log('OUT:', out)
    })
})
