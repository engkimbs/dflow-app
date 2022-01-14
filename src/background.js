'use strict'
import {app, protocol, BrowserWindow, ipcMain, dialog} from 'electron'
import ExcelJS from 'exceljs'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import {autoUpdater} from "electron-updater"
import axios from "axios";

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

let mainWindow
let loginWindow

async function createLoginWindow(devPath, prodPath) {
    loginWindow = new BrowserWindow({
        width: 300,
        height: 260,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js")
        },
        frame:false,
        //resizable: false
    })


    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await loginWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
        if (!process.env.IS_TEST)
            loginWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        loginWindow.loadURL('app://./index.html')
    }
    autoUpdater.checkForUpdatesAndNotify();
}

async function createMainWindow(devPath, prodPath) {
    mainWindow = new BrowserWindow({
        width: 2000,
        height: 1000,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js")
        },
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
        if (!process.env.IS_TEST)
            mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        mainWindow.loadURL('app://./index.html')
    }
    autoUpdater.checkForUpdatesAndNotify();
}

ipcMain.on('select-dirs', async (event, arg) => {
    const result = await dialog.showOpenDialog(win, {properties: ['openDirectory']})
    console.log('select-dirs!!')
    event.reply('get-file-path', result.filePaths)
})

ipcMain.on('login', async (event, account, password="") => {
    // if(process.env.NODE_ENV === "development") {
    //     let loginURL = 'http://localhost:80'
    //     await axios.get()
    // } else {
    //
    // }
    // firebase.auth().createUserWithEmailAndPassword(account, password)
    //     .then(
    //         function (user) {
    //             alert('회원가입 완료!')
    //             console.log(user)
    //         },
    //         function (err) {
    //             alert('에러 : ' + err.message)
    //         }
    //     )
    if(account === "eng.kimbs@gmail.com") {
        console.log(typeof(loginWindow))
        loginWindow.close()
        await createMainWindow('', 'index.html')
        mainWindow.show()
        event.reply('login-reply', true)
    }
    else {
        event.reply('login-reply', false)
    }
})

ipcMain.on('login-window-close', async (event) => {
    app.quit()
})

ipcMain.on('write-excel-files', async (event, path, headers, company_list) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("data");

    worksheet.columns = headers.map(header => {
        return {
            header: header.text,
            key: header.value,
        }
    })

    worksheet.getColumn(1).width = 40
    worksheet.getCell('A1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('A1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(2).width = 60
    worksheet.getCell('B1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('B1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(3).width = 20
    worksheet.getCell('C1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('C1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(4).width = 30
    worksheet.getCell('D1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('D1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(5).width = 20
    worksheet.getCell('E1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('E1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(6).width = 10
    worksheet.getCell('F1').font = {
        size: 13,
        bold: true

    }
    worksheet.getCell('F1').alignment = {
        horizontal: 'center'
    }
    worksheet.getColumn(7).width = 100
    worksheet.getCell('G1').font = {
        size: 13,
        bold: true
    }
    worksheet.getCell('G1').alignment = {
        horizontal: 'center'
    }

    company_list.map(data => {
        worksheet.addRow({
            name: data.name,
            address: data.address,
            phone: data.phone,
            category: data.category,
            keyword: data.keyword,
            rank: data.rank,
            website: data.website
        })
    })

    workbook.xlsx.writeFile(path + '\\result1.xlsx').then(() => console.log('done'))
    //workbook.xlsx.writeFile('result1.xlsx').then(() => console.log('done'))
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
})

app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    await createLoginWindow('login', 'login.html')
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
