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

let user

async function createLoginWindow(devPath, prodPath) {
    loginWindow = new BrowserWindow({
        width: 300,
        height: 450,
        webPreferences: {
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js")
        },
        frame:false,
        resizable: false,
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await loginWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
        if (!process.env.IS_TEST)
            loginWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        loginWindow.loadURL('app://./login.html')
    }
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
        autoHideMenuBar: true,
        icon: path.join(__dirname, "assets/logo.png")
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
        if (!process.env.IS_TEST)
            mainWindow.webContents.openDevTools()
    } else {
        createProtocol('app')
        mainWindow.loadURL('app://./index.html')
    }
}

ipcMain.on('select-dirs', async (event, arg) => {
    const path = await dialog.showSaveDialogSync(
        mainWindow, {
            title: '엑셀 파일 저장',
            defaultPath: '~/sample.xlsx',
            filters: [
                {name : '엑셀 파일', extensions: ['xlsx']}
            ]
        }
    )
    console.log(path)
    event.reply('get-file-path', path)
})

ipcMain.on('login', async (event, account, password="") => {
    let response = null
    if(process.env.NODE_ENV === "development") {
        let loginURL = 'http://localhost:5000/api/users/login'
        try {
            response = await axios.post(loginURL, {
                'email': account,
                'password': password
            })
        } catch (e) {

        }
    } else {
        let loginURL = 'http://dflowbackend-env.eba-eyxdwua9.ap-northeast-2.elasticbeanstalk.com:80/api/users/login'
        try {
            response = await axios.post(loginURL, {
                'email': account,
                'password': password
            })
        } catch (e) {

        }
    }

    if(response === null) {
        event.reply('login-reply', response)
    } else if(response.data) {
        user = response.data
        await createMainWindow('', 'index.html')
        mainWindow.show()
        event.reply('login-reply', response.data)
    }
    else {
        event.reply('login-reply', '')
    }
})

ipcMain.on('get-user-info', async (event) => {
    event.reply('get-user-info', user)
})

ipcMain.on('login-window-close', async (event) => {
    loginWindow.close()
})

ipcMain.on('login-success', async (event) => {
    console.log(user)
    event.reply(user)
})


ipcMain.on('write-excel-files', async (event, path, headers, company_list) => {
    console.log('write!!')

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

    workbook.xlsx.writeFile(path).then(() => console.log('done'))
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

    if(process.env.testmode === 'main') {
        createMainWindow('', 'index.html')
    } else {
        createLoginWindow('login', 'login.html')
    }
    autoUpdater.checkForUpdatesAndNotify();
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
