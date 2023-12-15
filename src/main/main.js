import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow;

const handleFileOpen = async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({});

    if (!canceled) {
        return filePaths[0];
    }
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.js'),
            webSecurity: false, 
            // Set to false to keep this example simple,
            // but in a real app, should be set to true.
            // Refer to https://github.com/electron/electron/issues/23393#issuecomment-623694579 for example.
        },
    });

    // Vite dev server URL
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.on('closed', () => mainWindow = null);
};

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen);
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
});
