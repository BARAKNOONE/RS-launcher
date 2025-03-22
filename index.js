const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const axios = require('axios');
const path = require('path');

const REPO_URL = "https://raw.githubusercontent.com/BARAKNOONE/RS-launcher/main/version.json"; // 🔹 เปลี่ยนเป็น URL ไฟล์ version.json
const CURRENT_VERSION = app.getVersion(); // 🔹 ดึงเวอร์ชันของแอปปัจจุบัน

let win;

async function checkForUpdates() {
  try {
    const response = await axios.get(REPO_URL);
    const latestVersion = response.data.latest;
    const downloadURL = response.data.download_url;

    console.log(`🔍 Latest Version: ${latestVersion}, Current Version: ${CURRENT_VERSION}`);

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
    resizable: false, // ❌ ป้องกันการปรับขนาด
    movable: true, // ✅ สามารถลากได้
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false
  });

  const updateURL = await checkForUpdates();

  if (updateURL) {
    // 🔻 แสดงหน้าอัปเดตก่อน
    win.loadFile('update.html');

    dialog.showMessageBox({
      type: 'info',
      title: 'มีเวอร์ชันใหม่!',
      message: 'มีเวอร์ชันใหม่พร้อมให้ดาวน์โหลด คุณต้องการเปิดลิงก์ดาวน์โหลดหรือไม่?',
      buttons: ['ดาวน์โหลดเลย', 'ภายหลัง']
    }).then((result) => {
      if (result.response === 0) {
        shell.openExternal(updateURL); // 🔗 เปิดลิงก์ดาวน์โหลด
      }
      win.close();
    });
  } else {
    // ✅ โหลดหน้าแอปปกติ
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
