
require('./settings')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const moment = require('moment-timezone')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { default: DannyTech20Connect, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers} = require("@whiskeysockets/baileys")
const PHONENUMBER_MCC = require('./lib/PairingPatch');
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const makeWASocket = require("@whiskeysockets/baileys").default
const { File } = require('megajs')
const express = require("express")

// Creepy_session System Start
if (!fs.existsSync('./Creepy_session')) {
    fs.mkdirSync('./Creepy_session')
}

if (!fs.existsSync('./Creepy_session/creds.json')) {
    if (global.SESSION_ID) {
        console.log(chalk.green('connecting to servers {IPv4:DannyTech2836/2025}'))
        const sessdata = global.SESSION_ID.replace("CREEPY-", '').replace("-Danny", '');
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
        filer.download((err, data) => {
            if (err) throw err
            fs.writeFile('./Creepy_session/creds.json', data, () => {
                console.log(chalk.yellow("Connected to whatsapp ✅"))
                startDannyTech20()
            })
        })
    } else {
        console.log(chalk.red('No session_ID provided,'))
        startDannyTech20()
    }
} else {
    startDannyTech20()
}

// Express server setup
const app = express()
const PORT = process.env.PORT || 9090

// Serve index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/", (req, res) => res.send("CREEPY_MD WhatsApp Bot"))
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
// Creepy_session System End

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let emojis = [];
let phoneNumber = "255697608274"
let owner = [global.ownernomer]

async function startDannyTech20() {
    const { state, saveCreds } = await useMultiFileAuthState('./Creepy_session')
    const { version } = await fetchLatestBaileysVersion()
    
    const DannyTech20 = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !fs.existsSync('./Creepy_Session/creds.json'),
        browser: Browsers.macOS('Desktop'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        version,
        getMessage: async (key) => {
            return {}
        },
    })

    store.bind(DannyTech20.ev)

    // Message handling
    DannyTech20.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                if (!DannyTech20.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            }
            
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            const m = smsg(DannyTech20, mek, store)
            require("./creepy_md-v1.js")(DannyTech20, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    //autostatus view
    DannyTech20.ev.on('messages.upsert', async chatUpdate => {
        if (global.autoswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await DannyTech20.readMessages([mek.key]) 
            }
        }
    })

 // ✅ Load emojis from external file
const { emojis } = require('./autoreact.js');
const dannyRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ✅ Default: Always auto-react to status updates
DannyTechInc.ev.on('messages.upsert', async chatUpdate => {
    try {
        const mek = chatUpdate.messages?.[0];
        if (!mek?.message || mek.key.fromMe) return;

        const from = mek.key.remoteJid;
        const isStatusUpdate = from === 'status@broadcast';
        if (!isStatusUpdate) return;

        await DannyTechInc.readMessages([mek.key]);

        const randomEmoji = dannyRandom(emojis);
        await DannyTechInc.sendMessage(from, {
            react: {
                text: randomEmoji,
                key: mek.key,
            }
        }, {
            statusJidList: [mek.key.participant || mek.participant]
        });

        console.log(`✅ Auto-reacted to status with: ${randomEmoji}`);
    } catch (error) {
        console.error("❌ Error auto-reacting to status:", error);
    }
});

// ✅ Newsletter JIDs to always auto-react to
const newsletterJids = [
    "120363307517794567@newsletter",
    // Add more newsletter JIDs if needed
];

// ✅ Always auto-react to newsletter posts
DannyTechInc.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const msg = chatUpdate.messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        if (newsletterJids.includes(sender)) {
            const serverId = msg.newsletterServerId;
            if (serverId) {
                const emoji = dannyRandom(emojis);
                await DannyTechInc.newsletterReactMessage(sender, serverId.toString(), emoji);
                console.log(`✅ Auto-reacted to newsletter with: ${emoji}`);
            }
        }
    } catch (err) {
        console.error("❌ Newsletter auto-reaction error:", err);
    }
});

    


 

    DannyTech20.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    DannyTech20.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = DannyTech20.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    DannyTech20.getName = (jid, withoutContact = false) => {
        id = DannyTech20.decodeJid(jid)
        withoutContact = DannyTech20.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = DannyTech20.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === DannyTech20.decodeJid(DannyTech20.user.id) ?
            DannyTech20.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    DannyTech20.public = true

    DannyTech20.serializeM = (m) => smsg(DannyTech20, m, store)

 DannyTech20.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s
    if (connection == "open") {
        console.log(chalk.magenta(` `))
        
        // Connection Box
        console.log(chalk.yellow.bold(`╔══════════════════════════════════╗`))
        console.log(chalk.yellow.bold(`║                                  ║`))
        console.log(chalk.yellow.bold(`║     🌿 CREEPY_MD-V1 CONNECTED    ║`))
        console.log(chalk.yellow.bold(`║         [CREATED BY DANNY]       ║`))
        console.log(chalk.yellow.bold(`║                                  ║`))
        console.log(chalk.yellow.bold(`╚══════════════════════════════════╝`))
        
        await delay(1500)
        
        // User Info Box
        console.log(chalk.green(`\n┌──────────────────────────────────┐`))
        console.log(chalk.green(`│  Connected User:                 │`))
        console.log(chalk.green(`└──────────────────────────────────┘`))
        console.log(chalk.cyan(JSON.stringify(DannyTech20.user, null, 2)))
        
        await delay(1000)
        
        // Bot Header
       console.log(chalk.blueBright(`
    ██████╗   █████╗  ███╗   ██╗ ███╗   ██╗ ██╗   ██╗
    ██╔══██╗ ██╔══██╗ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝
    ██║  ██║ ███████║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝ 
    ██║  ██║ ██╔══██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝  
    ██████╔╝ ██║  ██║ ██║ ╚████║ ██║ ╚████║    ██║   
    ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝   
`));
        
        // Social Media Box
        console.log(chalk.magenta(`╔════════════════════════════════════════╗`))
        console.log(chalk.magenta(`║           📢 SOCIAL LINKS             ║`))
        console.log(chalk.magenta(`╠════════════════════════════════════════╣`))
        console.log(chalk.magenta(`║ ${themeemoji} YT:  https://youtube.com/@creepy_tech ║`))
        console.log(chalk.magenta(`║ ${themeemoji} GIT: https://github.com/DannyTech20   ║`))
        console.log(chalk.magenta(`║ ${themeemoji} WA:  wa.me/dannytech                  ║`))
        console.log(chalk.magenta(`║                                        ║`))
        console.log(chalk.magenta(`║         CREDIT: ${chalk.bold.green('Danny Tech')}          ║`))
        console.log(chalk.magenta(`╚════════════════════════════════════════╝`))
    }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startDannyTech20()
        }
    })
    DannyTech20.ev.on('creds.update', saveCreds)
    DannyTech20.ev.on("messages.upsert",  () => { })

    DannyTech20.sendText = (jid, text, quoted = '', options) => DannyTech20.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    DannyTech20.sendTextWithMentions = async (jid, text, quoted, options = {}) => DannyTech20.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    DannyTech20.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await DannyTech20.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    DannyTech20.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await DannyTech20.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    DannyTech20.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }
    
    DannyTech20.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
            size: await getSizeMedia(data),
            ...type,
            data
        }
    }
    
    DannyTech20.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await DannyTech20.getFile(path, true)
        let { res, data: file, filename: pathFile } = type
        if (res && res.status !== 200 || file.length <= 65536) {
            try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
        }
        let opt = { filename }
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) {
            convert = await (ptt ? toPTT : toAudio)(file, type.ext)
            file = convert.data
            pathFile = convert.filename
            mtype = 'audio'
            mimetype = 'audio/ogg; codecs=opus'
        } else mtype = 'document'
        if (options.asDocument) mtype = 'document'
        delete options.asSticker
        delete options.asLocation
        delete options.asVideo
        delete options.asDocument
        delete options.asImage
        let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype }
        let m
        try { m = await DannyTech20.sendMessage(jid, message, { ...opt, ...options }) }
        catch (e) { m = null }
        finally {
            if (!m) m = await DannyTech20.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
            file = null
            return m
        }
    }

    DannyTech20.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return DannyTech20.sendMessage(jid, { poll: { name, values, selectableCount }}) }

    DannyTech20.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
            
    DannyTech20.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    return DannyTech20
}

process.on('uncaughtException', function (err) {
    let e = String(err)
    if (e.includes("conflict")) return
    if (e.includes("Cannot derive from empty media key")) return
    if (e.includes("Socket connection timeout")) return
    if (e.includes("not-authorized")) return
    if (e.includes("already-exists")) return
    if (e.includes("rate-overlimit")) return
    if (e.includes("Connection Closed")) return
    if (e.includes("Timed Out")) return
    if (e.includes("Value not found")) return
    console.log('Caught exception: ', err)
})