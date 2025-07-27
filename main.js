require('./settings');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const chalk = require('chalk');
const moment = require('moment-timezone');
const FileType = require('file-type');
const path = require('path');
const axios = require('axios');
const PhoneNumber = require('awesome-phonenumber');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc');
const crypto = require('crypto');
const { default: makeWASocket, delay, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers } = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const readline = require("readline");
const { parsePhoneNumber } = require("libphonenumber-js");
const express = require("express");
const { Readable } = require("stream");
const mime = require("mime-types");
const { getAudioUrl } = require("google-tts-api");

// Initialize Express server
const app = express();
const PORT = process.env.PORT || 9090;

// Basic route
app.get("/", (req, res) => res.send("CREEPY_MD WhatsApp Bot"));
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Session directory setup
const sessionDir = './creepy-session';
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir);
}

// Store initialization
const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
});

// Global variables
let emojis = ['👍', '❤️', '😂', '😮', '😢', '🔥']; // Default emojis if autoreact.js is missing
let phoneNumber = "255697608274";
let owner = global.ownernomer ? [global.ownernomer] : [];

async function initializeBot() {
    try {
        console.log(chalk.yellow('Initializing bot...'));
        
        // Load auth state
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        
        // Fetch latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(chalk.blue(`Using WA v${version.join('.')}, isLatest: ${isLatest}`));
        
        // Create socket connection
        const sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !fs.existsSync(`${sessionDir}/creds.json`),
            browser: Browsers.macOS('Desktop'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
            },
            version,
            getMessage: async (key) => {
                return {};
            },
        });

        // Bind store to socket events
        store.bind(sock.ev);

        // Connection update handler
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'open') {
                console.log(chalk.green('✓ Connected to WhatsApp'));
                showConnectedUI(sock);
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
                console.log(chalk.red(`Connection closed due to ${lastDisconnect.error}, reconnecting: ${shouldReconnect}`));
                
                if (shouldReconnect) {
                    setTimeout(initializeBot, 5000);
                }
            }
        });

        // Credentials update handler
        sock.ev.on('creds.update', saveCreds);

        // Message handler
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            try {
                const msg = messages[0];
                if (!msg.message || msg.key.fromMe) return;
                
                // Process message
                const m = smsg(sock, msg, store);
                
                // Load and execute main handler
                try {
                    const mainHandler = require('./danny-fnc/creepy_md-v1');
                    await mainHandler(sock, m, { messages, type }, store);
                } catch (err) {
                    console.error(chalk.red('Main handler error:'), err);
                }
                
            } catch (error) {
                console.error(chalk.red('Message processing error:'), error);
            }
        });

        // Utility functions
        sock.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return decode.user && decode.server ? `${decode.user}@${decode.server}` : jid;
            }
            return jid;
        };

        sock.getName = async (jid, withoutContact = false) => {
            id = sock.decodeJid(jid);
            withoutContact = sock.withoutContact || withoutContact;
            
            if (id.endsWith("@g.us")) {
                const groupMetadata = await sock.groupMetadata(id).catch(() => {});
                return groupMetadata?.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international');
            } else {
                const v = id === '0@s.whatsapp.net' ? {
                    id,
                    name: 'WhatsApp'
                } : id === sock.decodeJid(sock.user.id) ?
                sock.user :
                (store.contacts[id] || {});
                
                return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || 
                       PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
            }
        };

        return sock;

    } catch (error) {
        console.error(chalk.red('Initialization error:'), error);
        process.exit(1);
    }
}

// UI Functions
function showConnectedUI(sock) {
    console.log(chalk.yellow.bold(`╔══════════════════════════════════╗`));
    console.log(chalk.yellow.bold(`║                                  ║`));
    console.log(chalk.yellow.bold(`║     🌿 CREEPY_MD-V1 CONNECTED    ║`));
    console.log(chalk.yellow.bold(`║         [CREATED BY DANNY]       ║`));
    console.log(chalk.yellow.bold(`║                                  ║`));
    console.log(chalk.yellow.bold(`╚══════════════════════════════════╝`));
    
    console.log(chalk.green(`\n┌──────────────────────────────────┐`));
    console.log(chalk.green(`│  Connected User:                 │`));
    console.log(chalk.green(`└──────────────────────────────────┘`));
    console.log(chalk.cyan(JSON.stringify(sock.user, null, 2)));
    
    console.log(chalk.blueBright(`
    ██████╗   █████╗  ███╗   ██╗ ███╗   ██╗ ██╗   ██╗
    ██╔══██╗ ██╔══██╗ ████╗  ██║ ████╗  ██║ ╚██╗ ██╔╝
    ██║  ██║ ███████║ ██╔██╗ ██║ ██╔██╗ ██║  ╚████╔╝ 
    ██║  ██║ ██╔══██║ ██║╚██╗██║ ██║╚██╗██║   ╚██╔╝  
    ██████╔╝ ██║  ██║ ██║ ╚████║ ██║ ╚████║    ██║   
    ╚═════╝  ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚═╝  ╚═══╝    ╚═╝   
`));
    
    console.log(chalk.magenta(`╔════════════════════════════════════════╗`));
    console.log(chalk.magenta(`║           📢 SOCIAL LINKS             ║`));
    console.log(chalk.magenta(`╠════════════════════════════════════════╣`));
    console.log(chalk.magenta(`║ ▶ YT:  https://youtube.com/@creepy_tech ║`));
    console.log(chalk.magenta(`║ ▶ GIT: https://github.com/DannyTech20   ║`));
    console.log(chalk.magenta(`║ ▶ WA:  wa.me/dannytech                  ║`));
    console.log(chalk.magenta(`║                                        ║`));
    console.log(chalk.magenta(`║         CREDIT: ${chalk.bold.green('Danny Tech')}          ║`));
    console.log(chalk.magenta(`╚════════════════════════════════════════╝`));
}

// Error handling
process.on('uncaughtException', (err) => {
    const e = String(err);
    const ignorableErrors = [
        "conflict",
        "Cannot derive from empty media key",
        "Socket connection timeout",
        "not-authorized",
        "already-exists",
        "rate-overlimit",
        "Connection Closed",
        "Timed Out",
        "Value not found"
    ];
    
    if (!ignorableErrors.some(error => e.includes(error))) {
        console.error(chalk.red('Uncaught Exception:'), err);
    }
});

// Start the bot
initializeBot().catch(err => {
    console.error(chalk.red('Failed to initialize bot:'), err);
    process.exit(1);
});