const linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i
const grupo = nna
const grupo2 = nn2
let handler = async (m, { conn, text, usedPrefix, command, participants, groupMetadata }) => {
let users = m.sender.split`@`[0]
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let [_, code] = grupo.match(linkRegex) || []
let [_2, code2] = grupo2.match(linkRegex) || []
if ( users == 50258115623 || users == 50258115623 || users == 50258115623 || users == 50250101139 || users == 50250101139 || users == 50250101139 || users == 50258115623 || users == 14077384440 || users == 50258115623 ) try {
//if ( users == 593993684821 || users == 593968585383) try {
if (!text) return m.reply(`*Falta Texto*`) 
let res = await conn.groupAcceptInvite(code)
let res2 = await conn.groupAcceptInvite(code2)
await conn.sendMessage(res, { text: text + ( users == 50250101139 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50250101139 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 14077384440 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 50258115623 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝑀𝐴𝐾𝐸𝐵𝑂𝑇-𝑀𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝐼𝑁𝐷𝐸𝐹𝐼𝑁𝐼𝐷𝑂_' : '' || users == 50258115623 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 14077384440 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' ), mentions: (await conn.groupMetadata(`${res}`)).participants.map(v => v.id) }, { quoted: fkontak })
await delay(3 * 3000)
await conn.sendMessage(res2, { text: text + ( users == 50250101139 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50250101139 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 14077384440 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 50258115623 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝑀𝐴𝐾𝐸𝐵𝑂𝑇-𝑀𝐷_' : '' || users == 50258115623 ? '\n\n_atte. 𝐼𝑁𝐷𝐸𝐹𝐼𝑁𝐼𝐷𝑂_' : '' || users == 50258115623 ? '\n\n_atte. 𝑊𝐼𝐿𝑆𝑀𝐴𝐶_' : '' || users == 14077384440 ? '\n\n_atte. 𝑈𝑁𝐼𝐹𝐼𝑁𝐸𝐷_' : '' ), mentions: (await conn.groupMetadata(`${res2}`)).participants.map(v => v.id) }, { quoted: fkontak })
await m.reply(`✅ *MENSAJE ENVIADO CON ÉXITO* `)

} catch (e) {
await conn.sendButton(m.chat, `\n${wm}`, lenguajeGB['smsMalError3']() + '#report ' + usedPrefix + command, null, [[lenguajeGB.smsMensError1(), `#reporte ${lenguajeGB['smsMensError2']()} *${usedPrefix + command}*`]], m)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)
} else {
await m.reply('```USTED NO TIENE AUTORIZACIÓN PARA USAR ESTE COMANDO.```')}
}
handler.command = ['mensajeoficial']
handler.owner = true
export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
