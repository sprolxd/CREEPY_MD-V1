//Creaed By Danny
//wa.me/dannytech


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
const crypto = require('crypto')
const { default: DannyTechIncConnect, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers} = require("@whiskeysockets/baileys")
const PHONENUMBER_MCC = require('./lib/PairingPatch');
const NodeCache = require("node-cache")
const Pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const makeWASocket = require("@whiskeysockets/baileys").default
const { File } = require('megajs')
const express = require("express")
const { Readable } = require("stream");
const mime = require("mime-types");
const { getAudioUrl } = require("google-tts-api");
const googleTTS = require('google-tts-api');
const FormData = require('form-data'); 



// creepy-session System Start
if (!fs.existsSync('./creepy-session')) {
    fs.mkdirSync('./creepy-session')
}

if (!fs.existsSync('./creepy-session/creds.json')) {
    if (global.SESSION_ID) {
        console.log('Connecting to creepy-session...')
        const sessdata = global.SESSION_ID.replace("CREEPY-", '').replace("-Danny", '');
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
        filer.download((err, data) => {
            if (err) throw err
            fs.writeFile('./creepy-session/creds.json', data, () => {
                console.log("creepy-session downloaded ✅")
                startDannyTechInc()
            })
        })
    } else {
        console.log('No SESSION_ID provided,')
        startDannyTechInc()
    }
} else {
    startDannyTechInc()
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
// creepy-session System End

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let emojis = [];
let phoneNumber = "255687608274"
let owner = [global.ownernomer]

async function startDannyTechInc() {
    const { state, saveCreds } = await useMultiFileAuthState('./creepy-session')
    const { version } = await fetchLatestBaileysVersion()
    
    const DannyTechInc = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !fs.existsSync('./creepy-session/creds.json'),
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

    store.bind(DannyTechInc.ev)

    // Message handling
    DannyTechInc.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                if (!DannyTechInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            }
            
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            const m = smsg(DannyTechInc, mek, store)
            require("./creepy_md-v1")(DannyTechInc, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    //autostatus view
    DannyTechInc.ev.on('messages.upsert', async chatUpdate => {
        if (global.autoswview){
            mek = chatUpdate.messages[0]
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await DannyTechInc.readMessages([mek.key]) 
            }
        }
    })

     // Auto-react to status updates
DannyTechInc.ev.on('messages.upsert', async chatUpdate => {
    try {
        // Load settings
        let autoreactData = {};
        try {
            autoreactData = JSON.parse(fs.readFileSync('./database/autoreactstatus.json'));
        } catch (err) {
            console.error('Error loading autoreact.json:', err);
            return;
        }

        // Check if feature is enabled
        if (!autoreactData.statusReact && !global.likestatus) return;

        const mek = chatUpdate.messages[0];
        if (!mek.message || mek.key.fromMe) return;
        const from = mek.key.remoteJid;
        const isStatusUpdate = from === 'status@broadcast';
        if (!isStatusUpdate) return;

        await DannyTechInc.readMessages([mek.key]);
        
        // Get emojis from autoreact.js
        const { emojis } = require('./autoreact');
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        await DannyTechInc.sendMessage(from, {
            react: {
                text: randomEmoji,
                key: mek.key,
            }
        }, {
            statusJidList: [mek.key.participant || mek.participant]
        });
        console.log(`Auto-reacted to status update with: ${randomEmoji}`);
    } catch (error) {
        console.error("Error auto-reacting to status:", error);
    }
});

// Newsletter JIDs to auto-react to
const newsletterJids = ["120363307517794567@newsletter"];

// Extended emoji list for fun & variety
const newsletterEmojis = require('./autoreact.js');

// Utility to pick random emoji fast
const dannyRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Listen to incoming messages
DannyTechInc.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const msg = chatUpdate.messages?.[0];
        if (!msg || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;

        // ✅ Auto-react only to newsletter messages
        if (newsletterJids.includes(sender)) {
            const serverId = msg.newsletterServerId;
            if (serverId) {
                const emoji = dannyRandom(newsletterEmojis);
                await DannyTechInc.newsletterReactMessage(sender, serverId.toString(), emoji);
            }
        }

    } catch (err) {
        console.error("❌ Newsletter auto-reaction error:", err);
    }
});


 

// Main message handler
DannyTechInc.ev.on('messages.upsert', async ({ messages }) => {
  if (!messages?.length) return;
  
  const [message] = messages;
  if (!message.message || message.key.fromMe) return;
  if (message.key.remoteJid === 'status@broadcast') return;

  const settings = loadReactionSettings();
  if (!settings.global) return;

  const { remoteJid: chatJid, participant: sender } = message.key;
  const senderJid = sender || chatJid;

  // Check exclusions
  if (settings.excludedChats?.includes(chatJid)) return;
  if (settings.excludedUsers?.includes(senderJid)) return;

  try {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const success = await sendReaction(DannyTechInc, chatJid, message.key, emoji);

    if (success) {
      console.log(chalk.green(`[REACT]`), 
                chalk.cyan(emoji), 
                'to', 
                chalk.yellow(senderJid.split('@')[0]));
    }
  } catch (error) {
    console.error(chalk.red('[REACT FAILED]'), 
                'to', 
                chalk.yellow(senderJid), 
                '-', 
                error.message);
  }
});




    DannyTechInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    DannyTechInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = DannyTechInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = {
                id,
                name: contact.notify
            }
        }
    })

    DannyTechInc.getName = (jid, withoutContact = false) => {
        id = DannyTechInc.decodeJid(jid)
        withoutContact = DannyTechInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = DannyTechInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === DannyTechInc.decodeJid(DannyTechInc.user.id) ?
            DannyTechInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    DannyTechInc.public = true

    DannyTechInc.serializeM = (m) => smsg(DannyTechInc, m, store)

  DannyTechInc.ev.on("connection.update", async (s) => {
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
        console.log(chalk.cyan(JSON.stringify(DannyTechInc.user, null, 2)))
        
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
        startDannyTechInc()
    }
})
    DannyTechInc.ev.on('creds.update', saveCreds)
    DannyTechInc.ev.on("messages.upsert",  () => { })

    DannyTechInc.sendText = (jid, text, quoted = '', options) => DannyTechInc.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted,
        ...options
    })
    DannyTechInc.sendTextWithMentions = async (jid, text, quoted, options = {}) => DannyTechInc.sendMessage(jid, {
        text: text,
        mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
        ...options
    }, {
        quoted
    })
    DannyTechInc.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await DannyTechInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    DannyTechInc.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await DannyTechInc.sendMessage(jid, {
            sticker: {
                url: buffer
            },
            ...options
        }, {
            quoted
        })
        return buffer
    }
    DannyTechInc.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
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
    
    DannyTechInc.getFile = async (PATH, save) => {
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
    
    DannyTechInc.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
        let type = await DannyTechInc.getFile(path, true)
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
        try { m = await DannyTechInc.sendMessage(jid, message, { ...opt, ...options }) }
        catch (e) { m = null }
        finally {
            if (!m) m = await DannyTechInc.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
            file = null
            return m
        }
    }

    DannyTechInc.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return DannyTechInc.sendMessage(jid, { poll: { name, values, selectableCount }}) }

    DannyTechInc.parseMention = (text = '') => {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
            
    DannyTechInc.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }
    return DannyTechInc
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