process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0' 
import './config.js'
import {createRequire} from 'module'
import path, {join} from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs'
import * as readlineSync from 'readline-sync'
import readline from 'readline'
import prompt from 'prompt-sync'
import inquirer from 'inquirer'
import yargs from 'yargs'
import {spawn} from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import fs from 'fs'
import { watchFile, unwatchFile } from 'fs'  
import {format} from 'util'
import P from 'pino'
import pino from 'pino'
import {Boom} from '@hapi/boom';
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore} = await import('@whiskeysockets/baileys')
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '')
global.timestamp = {start: new Date};

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@aA').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`))

global.DATABASE = global.db; // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this);
resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
}}, 1 * 1000))}

if (global.db.data !== null) return
global.db.READ = true
await global.db.read().catch(console.error)
global.db.READ = null
global.db.data = { users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {}, ...(global.db.data || {}), }
global.db.chain = chain(global.db.data)
}
loadDatabase()

global.chatgpt = new Low(new JSONFile(path.join(__dirname, '/db/chatgpt.json')))
global.loadChatgptDB = async function loadChatgptDB() {
if (global.chatgpt.READ) {
return new Promise((resolve) =>
setInterval(async function() {
if (!global.chatgpt.READ) {
clearInterval(this)
resolve( global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data )
}}, 1 * 1000))}
if (global.chatgpt.data !== null) return
global.chatgpt.READ = true;
await global.chatgpt.read().catch(console.error)
global.chatgpt.READ = null
global.chatgpt.data = {
users: {},
...(global.chatgpt.data || {}),
}
global.chatgpt.chain = lodash.chain(global.chatgpt.data)
}
loadChatgptDB()

global.authFile = `GataBotSession`;
const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile)
const msgRetryCounterMap = (MessageRetryMap) => { }
const {version} = await fetchLatestBaileysVersion()
const connectionOptions = {
printQRInTerminal: true,
patchMessageBeforeSending: (message) => {
const requiresPatch = !!( message.buttonsMessage || message.templateMessage || message.listMessage )
if (requiresPatch) {
message = {viewOnceMessage: {message: {messageContextInfo: {deviceListMetadataVersion: 2, deviceListMetadata: {}}, ...message}}}
}
return message
},
getMessage: async (key) => {
if (store) {
const msg = await store.loadMessage(key.remoteJid, key.id)
return conn.chats[key.remoteJid] && conn.chats[key.remoteJid].messages[key.id] ? conn.chats[key.remoteJid].messages[key.id].message : undefined
}
return proto.Message.fromObject({})
},
msgRetryCounterMap,
logger: pino({level: 'silent'}),
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})),
},
browser: ['MAKEBOT-MD','Edge','2.0.0'],
version,
defaultQueryTimeoutMs: undefined,
}
 
const supportedLanguages = ['es', 'en', 'pt', 'ar', 'id']
const configPath = path.join(__dirname, 'config.js')
let configContent = fs.readFileSync(configPath, 'utf8')
if (!global.languageLen) {
promptLoop()
} else {
console.log(chalk.bold.greenBright(lenguajeGB.languageSave()))}
function promptLoop() {
console.log(`
╭⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯ 𖤍             
┆ • ${chalk.bold.magentaBright('Select a language.')}
┆ • ${chalk.bold.magentaBright('Seleccione un idioma.')}
╰⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯ 𖤍           
┆ ${chalk.bold.cyanBright('1')} → ${chalk.bold.greenBright('"es" (Español)')}
┆ ${chalk.bold.cyanBright('2')} → ${chalk.bold.greenBright('"en" (English)')}
┆ ${chalk.bold.cyanBright('3')} → ${chalk.bold.greenBright('"pt" (Português)')}
┆ ${chalk.bold.cyanBright('4')} → ${chalk.bold.greenBright('"ar" (عرب / Arab)')}
┆ ${chalk.bold.cyanBright('5')} → ${chalk.bold.greenBright('"id" (Indonesia)')}
┆ ${chalk.bold.cyanBright('6')} → ${chalk.bold.greenBright('(Omitir / Skip)')}
╰⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯⋯ 𖤍         
⚠️ ${chalk.bold.yellowBright('If you choose to skip, you will not have the opportunity to change the language later through the console.')}
⚠️ ${chalk.bold.yellowBright('Si elige omitir, no tendrá oportunidad de cambiar el idioma más tarde a través de la consola.')}\n
⬇️  ⬇️  ⬇️`.trim())
const options = ['es', 'en', 'pt', 'ar', 'id', 'Omitir / Skip']
const formattedOptions = options.map(option => chalk.bold.blueBright(option))
const selectedOptionIndex = readlineSync.keyInSelect(formattedOptions, `${chalk.bold.magentaBright('Write the number of the option.\nEscriba el número de la opción.')} `, { cancel: false })
if (selectedOptionIndex >= 0 && selectedOptionIndex <= 4) {
const selectedLanguage = supportedLanguages[selectedOptionIndex]
configContent = configContent.replace('global.languageLen = ""', 'global.languageLen = true')
configContent = configContent.replace('global.lenguajeGB = es', `global.lenguajeGB = ${selectedLanguage}`)
fs.writeFileSync(configPath, configContent, 'utf8')
console.log(chalk.bold.cyanBright(lenguajeGB.languageRegister(selectedLanguage)))
} else if (selectedOptionIndex === 5) {
configContent = configContent.replace('global.languageLen = ""', 'global.languageLen = true')
fs.writeFileSync(configPath, configContent, 'utf8')
console.log(chalk.bold.cyanBright(`\n🆗 Ignoring language settings.`))
console.log(chalk.bold.cyanBright(`🆗 Omitiendo la configuración del idioma.\n`))
} else {
console.log(chalk.bold.redBright(`\n❌ Invalid option. Remember to write only the number of the option.`))
console.log(chalk.bold.redBright(`❌ Opción no válida. Recuerde escribir sólo el número de la opción.\n`))
process.send('reset')
}}

/*const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
async function main() {
if (registerNumber === "" || registerNumber === null || registerNumber === false) {
setTimeout(() => {
if (registerNumber === "") {
configContent = configContent.replace('global.registerNumber = ""', 'global.registerNumber = true')
fs.writeFileSync(configPath, configContent, 'utf8')
console.log('\nTiempo agotado o se ha omitido la adición de número/s como propietario/s.')
rl.close()
}}, 60000)
// } else {
//console.log('\nEl registro de número ya se ha realizado o se ha omitido previamente.')
//   rl.close();
// }}
console.log('Escriba el número que será propietario, ejemplo: +593 99 000 0000')
console.log('Si piensa agregar varios números separados por ",", ejemplo: +593 99 000 0000, +52 1 000 000 0000, +598 00 000 000')
const phoneNumberInput = await questionAsync('Si desea omitir, escriba "0": ')
if (phoneNumberInput !== '0' && phoneNumberInput !== '"0"' && phoneNumberInput !== '') {
const cleanedNumbers = phoneNumberInput.split(',').map(number => number.replace(/[\s+\-()]/g, '').trim())
const newNumbersArray = cleanedNumbers.map(number => cleanedNumbers.length === 1 ? `'${number}'` : `['${number}']`).join(', ')
const regex = /(global\.owner\s*=\s*\[\s*[\s\S]*?\s*\])\s*\]/
configContent = configContent.replace(regex, cleanedNumbers.length === 1 ? `$1, [${newNumbersArray}]]` : `$1, ${newNumbersArray}]`)
configContent = configContent.replace('global.registerNumber = ""', 'global.registerNumber = true')
fs.writeFileSync(configPath, configContent, 'utf8')
if (cleanedNumbers.length === 1) {
console.log(`\nSe ha agregado el número "+${cleanedNumbers[0]}" como propietario.`)
} else {
console.log(`\nSe han agregado los números "+${cleanedNumbers.join(', ')}" como propietarios.`)
}} else {
configContent = configContent.replace('global.registerNumber = ""', 'global.registerNumber = true')
fs.writeFileSync(configPath, configContent, 'utf8')
console.log('\nSe ha omitido la adición de número/s como propietario/s.')
}} else {
console.log('\nEl registro de número ya se ha realizado o se ha omitido previamente.')
rl.close()
}}
function questionAsync(question) {
return new Promise(resolve => {
rl.question(question, answer => {
resolve(answer);
})
})}
main()*/

/*console.log('Escriba el número que será propietario, ejemplo: +593 99 000 0000')
console.log('Si piensa agregar varios números separé por "," ejemplo: +593 99 000 0000, +52 1 000 000 0000, +598 00 000 000')
const phoneNumberInput = readlineSync.question('Si desea omitir, escriba "0": ')
if (phoneNumberInput !== '0' && phoneNumberInput !== '"0"') {
const cleanedNumbers = phoneNumberInput.split(',').map(number => number.replace(/[\s+\-()]/g, '').trim())
const newNumbersArray = cleanedNumbers.map(number => cleanedNumbers.length === 1 ? `'${number}'` : `['${number}']`).join(', ')
const regex = /(global\.owner\s*=\s*\[\s*[\s\S]*?\s*\])\s*\]/
const newConfigContent = configContent.replace(regex, cleanedNumbers.length === 1 ? `$1, [${newNumbersArray}]]` : `$1, ${newNumbersArray}]`)
fs.writeFileSync(configPath, newConfigContent, 'utf8')
if (cleanedNumbers.length === 1) {
console.log(`\nSe ha agregado el número "+${cleanedNumbers[0]}" como propietario.`)
} else {
console.log(`\nSe han agregado los números "+${cleanedNumbers.join(', ')}" como propietarios.`)
}} else {
console.log('\nSe ha omitido la adición de número/s como propietario/s.')
}*/

global.conn = makeWASocket(connectionOptions)
conn.isInit = false
conn.well = false

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', "GataJadiBot"], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '2', '-type', 'f', '-delete'])))}, 30 * 1000)}
if (opts['server']) (await import('./server.js')).default(global.conn, PORT)

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update
global.stopped = connection
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
console.log(await global.reloadHandler(true).catch(console.error))
global.timestamp.connect = new Date
}
if (global.db.data == null) loadDatabase()
if (update.qr != 0 && update.qr != undefined) {
console.log(chalk.bold.yellow(lenguajeGB['smsCodigoQR']()))}
if (connection == 'open') {
console.log(chalk.bold.greenBright(lenguajeGB['smsConexion']()))}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionOFF']()))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(lenguajeGB['smsConexioncerrar']()))
process.send('reset')
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(lenguajeGB['smsConexionperdida']()))
process.send('reset')
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(chalk.bold.yellowBright(lenguajeGB['smsConexionreem']()))
} else if (reason === DisconnectReason.loggedOut) {
console.log(chalk.bold.redBright(lenguajeGB['smsConexionOFF']()))
} else if (reason === DisconnectReason.restartRequired) {
console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionreinicio']()))
} else if (reason === DisconnectReason.timedOut) {
console.log(chalk.bold.yellowBright(lenguajeGB['smsConexiontiem']()))
process.send('reset')
} else {
console.log(chalk.bold.redBright(lenguajeGB['smsConexiondescon'](reason, connection)))
}}
}
process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e)
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler);
conn.ev.off('group-participants.update', conn.participantsUpdate);
conn.ev.off('groups.update', conn.groupsUpdate);
conn.ev.off('message.delete', conn.onDelete);
conn.ev.off('call', conn.onCall);
conn.ev.off('connection.update', conn.connectionUpdate);
conn.ev.off('creds.update', conn.credsUpdate);
}

//Información para Grupos
conn.welcome = lenguajeGB['smsWelcome']() 
conn.bye = lenguajeGB['smsBye']() 
conn.spromote = lenguajeGB['smsSpromote']() 
conn.sdemote = lenguajeGB['smsSdemote']() 
conn.sDesc = lenguajeGB['smsSdesc']() 
conn.sSubject = lenguajeGB['smsSsubject']() 
conn.sIcon = lenguajeGB['smsSicon']() 
conn.sRevoke = lenguajeGB['smsSrevoke']() 

conn.handler = handler.handler.bind(global.conn);
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
conn.onDelete = handler.deleteUpdate.bind(global.conn);
conn.onCall = handler.callUpdate.bind(global.conn);
conn.connectionUpdate = connectionUpdate.bind(global.conn);
conn.credsUpdate = saveCreds.bind(global.conn, true);

conn.ev.on('messages.upsert', conn.handler);
conn.ev.on('group-participants.update', conn.participantsUpdate);
conn.ev.on('groups.update', conn.groupsUpdate);
conn.ev.on('message.delete', conn.onDelete);
conn.ev.on('call', conn.onCall);
conn.ev.on('connection.update', conn.connectionUpdate);
conn.ev.on('creds.update', conn.credsUpdate);
isInit = false
return true
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file);
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e);
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
else {
conn.logger.warn(`deleted plugin - '${filename}'`)
return delete global.plugins[filename]
}} else conn.logger.info(`new plugin - '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
})
    
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}

Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
const test = await Promise.all([ spawn('ffmpeg'), spawn('ffprobe'), spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'), spawn('magick'), spawn('gm'), spawn('find', ['--version']), ].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127)
})}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false))
})])
}))
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find}
Object.freeze(global.support)
}

function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}

function purgeSession() {
let prekey = []
let directorio = readdirSync("./GataBotSession")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-') || file.startsWith('session-') || file.startsWith('sender-') || file.startsWith('app-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./GataBotSession/${files}`)
})
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync('./GataJadiBot/');
let SBprekey = [];
listaDirectorios.forEach(directorio => {
if (statSync(`./GataJadiBot/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./GataJadiBot/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-') || fileInDir.startsWith('app-') || fileInDir.startsWith('session-')
})
SBprekey = [...SBprekey, ...DSBPreKeys];
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
unlinkSync(`./GataJadiBot/${directorio}/${fileInDir}`)
}})
}})
if (SBprekey.length === 0) {
console.log(chalk.bold.green(lenguajeGB.smspurgeSessionSB1()))
} else {
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSessionSB2()))
}} catch (err) {
console.log(chalk.bold.red(lenguajeGB.smspurgeSessionSB3() + err))
}}

function purgeOldFiles() {
const directories = ['./GataBotSession/', './GataJadiBot/']
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
if (file !== 'creds.json') {
const filePath = path.join(dir, file);
unlinkSync(filePath, err => {
if (err) {
console.log(chalk.bold.red(`${lenguajeGB.smspurgeOldFiles3()} ${file} ${lenguajeGB.smspurgeOldFiles4()}` + err))
} else {
console.log(chalk.bold.green(`${lenguajeGB.smspurgeOldFiles1()} ${file} ${lenguajeGB.smspurgeOldFiles2()}`))
} }) }
}) }) }) }

setInterval(async () => {
await clearTmp()        
console.log(chalk.bold.cyanBright(lenguajeGB.smsClearTmp()))}, 1000 * 60 * 4) // 4 min 

setInterval(async () => {
await purgeSession()
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSession()))}, 1000 * 60 * 10) // 10 min

setInterval(async () => {
await purgeSessionSB()}, 1000 * 60 * 10)

setInterval(async () => {
await purgeOldFiles()
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeOldFiles()))}, 1000 * 60 * 10)

_quickTest().then(() => conn.logger.info(chalk.bold(lenguajeGB['smsCargando']().trim()))).catch(console.error)

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.bold.greenBright(lenguajeGB['smsMainBot']().trim()))
import(`${file}?update=${Date.now()}`)
})
