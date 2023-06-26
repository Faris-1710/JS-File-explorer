const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const menu = []

function createWindow() {
	const win = new BrowserWindow({
		title: 'File explorer',
		width: 800,
		height: 600,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preLoad.js'),
			nodeIntegration: true,
			contextIsolation: true
		}
	})

	win.setIcon(path.join(__dirname, 'assets/logo.ico'))
	win.loadFile(path.join(__dirname, './source/index.html'))
}

const menubar = Menu.buildFromTemplate(menu)
Menu.setApplicationMenu(menubar)

app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
})

app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') app.quit()
})