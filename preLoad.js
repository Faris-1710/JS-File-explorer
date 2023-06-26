const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

contextBridge.exposeInMainWorld('defined_functions', {
    isPathDirectory: (path) => fs.lstatSync(path).isDirectory(),
    desktopPath: () => require('os').homedir().replaceAll('\\', '/') + '/Desktop',
    writeToFile: (file_path, newValue) => {
        fs.readFile(file_path, 'utf-8', function(error, data) {
            if (error) {
                console.error(error)
                return
            }
         
            fs.writeFile(file_path, newValue, 'utf-8', function(error, data) {
                if (error) {
                    console.error(error)
                    return
                }
            })
        })
    }
})

contextBridge.exposeInMainWorld('fs', {
    readdir: (...args) => fs.readdir(...args),
    existsSync: (...args) => fs.existsSync(...args),
    readFile: (...args) => fs.readFile(...args),
    mkdirSync: (...args) => fs.mkdirSync(...args),
    writeFileSync: (...args) => fs.writeFileSync(...args)
})

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args),
    dirname: (...args) => path.dirname(...args)
})

contextBridge.exposeInMainWorld('child_process', {
    exec: (...args) => child_process.exec(...args)
})