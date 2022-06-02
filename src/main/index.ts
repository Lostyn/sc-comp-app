import { app, BrowserWindow } from 'electron';
import path from "path";
import url from "url";
import MainDialogService from './services/dialogService';
import * as IPC from './contansts/ipc';
import MainCaptureService from './services/mainCaptureService';
import MainWindowService from './services/windowService';

class Main {
    isDev: boolean;
    mainWindow: BrowserWindow | undefined;

    constructor() {
        this.isDev = process.env.NODE_ENV === 'development';

        if (!app.requestSingleInstanceLock())
            app.exit();

        // used to remove warning
        //  Passthrough is not supported, GL is disabled, ANGLE is
        app.disableHardwareAcceleration();
    }

    start(): void {
        try {
            this.startup();
        } catch (error) {
            app.exit(1);
        }
    }

    private startup() {
        app.on('ready', async () => {
            // TODO: instantiationService ?
            const mainDialogService = new MainDialogService();
            const captureService = new MainCaptureService();
            const mainWindowService = new MainWindowService();

            this.mainWindow = mainWindowService.createWindow(
                {
                    width: 800,
                    height: 185,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                    },
                    frame: false,
                    resizable: true,
                    show: false
                }
            );

            // this.registerRendererProcess();
            this.mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, '../renderer/index.html'),
                protocol: 'file:',
                slashes: true
            }));

            const mainReadyToShow = new Promise(resolve => this.mainWindow?.once('ready-to-show', resolve));
            await mainReadyToShow;
            this.mainWindow.show();

            if (this.isDev) {
                this.connectElectronClient();
            }

            this.registerWindowListener();
        })

        app.on('window-all-closed', () => {
            app.quit();
        })
    }

    connectElectronClient() {
        var { client } = require('electron-connect');
        client.create(this.mainWindow, { port: 30030 });
        this.mainWindow?.webContents.openDevTools();
    }

    registerWindowListener() {
        this.mainWindow?.on('closed', () => {
            this.mainWindow = undefined;
        })

        this.mainWindow.webContents.on('before-input-event', (event, input) => {
            var type = input.type;
            if (input.isAutoRepeat) type = type + "-repeat";
            const code = `${type}.${input.code}`;
            this.mainWindow.webContents.send(IPC.SHORTCUT, code);
        });
    }
}

const main = new Main();
main.start();