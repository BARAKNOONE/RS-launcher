const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const axios = require('axios');
const path = require('path');

const REPO_VERSION_URL = "https://raw.githubusercontent.com/BARAKNOONE/RS-launcher/main/version.json"; // URL ของ version.json
const CURRENT_VERSION = "0.0.1"; // เวอร์ชันปัจจุบันของแอป

let win;

async function checkForUpdates() {
  try {
    const response = await axios.get(REPO_VERSION_URL);
    const latestVersion = response.data.latest;
    const downloadURL = response.data.download_url;

    console.log(`🔍 Latest Version: ${latestVersion}, Current Version: ${CURRENT_VERSION}`); // แสดงเวอร์ชันใน Console

    if (latestVersion !== CURRENT_VERSION) {
      console.log("🔔 มีอัปเดตใหม่!");
      return downloadURL;
    }
    return null;
  } catch (error) {
    console.error("🚨 Error fetching version:", error);
    return null;
  }
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 500,
    resizable: false,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false
  });

  // เปิด DevTools สำหรับตรวจสอบ Console
  win.webContents.openDevTools();

  const updateURL = await checkForUpdates();

  if (updateURL) {
    win.loadFile('update.html');
  } else {
    win.loadFile('index.html');
  }
}

app.on('ready', createWindow);

ipcMain.on('minimize-window', () => {
  win.minimize();
});

ipcMain.on('close-window', () => {
  win.close();
});
