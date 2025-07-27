//=================================[CREATED BY DANNY]===============================\\
//========================[wa.me/dannytech]==================\\

const { default: makeWASocket, fetchLatestBaileysVersion, downloadContentFromMessage, useMultiFileAuthState, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const os = require('os')
const fs = require('fs')
const fsx = require('fs-extra')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const moment = require('moment-timezone')
const speed = require('performance-now')
const ms = toMs = require('ms')
const axios = require('axios')
const fetch = require('node-fetch')
const pino = require('pino')
const readline = require("readline");
const { exec, spawn, execSync } = require("child_process")
const { performance } = require('perf_hooks')
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)
const { TelegraPh, UploadFileUgu, webp2mp4File, floNime } = require('./lib/uploader')
const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar } = require('./lib/converter')
const { smsg, getGroupAdmins, formatp, jam, formatDate, getTime, isUrl, await, sleep, clockString, msToDate, sort, toNumber, enumGetKey, runtime, fetchJson, getBuffer, json, delay, format, logic, generateProfilePicture, parseMention, getRandom, pickRandom, reSize } = require('./lib/myfunc')
let afk = require("./lib/afk");
const { addPremiumUser, getPremiumExpired, getPremiumPosition, expiredCheck, checkPremiumUser, getAllPremiumUser } = require('./lib/premiun')
const { fetchBuffer, buffergif } = require("./lib/myfunc2")
const NodeCache = require('node-cache');
const Danny = require('Danny');

 //reply
        const replyglobal = (teks) => {
            DannyTechInc.sendMessage(m.chat,
                {
                    text: teks,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 9999999,
                        isForwarded: false,
                        "externalAdReply": {
                            "showAdAttribution": true,
                            "containsAutoReply": true,
                            "title": ` ${global.botname}`,
                            "body": `${ownername}`,
                            "previewType": "PHOTO",
                            "thumbnailUrl": ``,
                            "thumbnail": fs.readFileSync(`./DannyMedia/thumb.jpg`),
                            "sourceUrl": `${link}`
                        }
                    }
                },
                { quoted: m })
        }


switch (command) {


          case 'menu':
                {
                    let reaction = sendReaction('🎉');
                    let menuMessage = `
╭─────────────────────────╮
│   ┃ *\`𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏\`*  ┃
├─────────────────────────┤
│ *Hello* \`${pushname}\`,                      
│ *My name is 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏* 
│ *Type \`Creepy\` to see the full menu*                  
╰─────────────────────────╯
`.trim();

                    await DannyTechInc.sendMessage(m.chat, {
                        text: menuMessage,
                        contextInfo: {
                            externalAdReply: {
                                showAdAttribution: true,
                                title: `${botname}`,
                                body: `CREEPY_MD-V1 created by Danny`,
                                thumbnailUrl: 'https://files.catbox.moe/f6j3fl.jpeg',
                                sourceUrl: global.link,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {
                        quoted: m
                    });
                }
                break
            case 'creepy':
            case 'kaylah':
            case 'creepy-md':
                let reaction = sendReaction('🎉');
                let creepmenuoh = `
╭─────────────────────╮
│   ┃ *\`𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏\`*  ┃
├─────────────────────┤
│ *Hello* \`${pushname}\`,                      
│ *My name is 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏*                 
╰─────────────────────╯
╭───[ \`𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔\` ]────╮
│ ◆ *creepy*                                      
│ ◆ *menu*                                        
│ ◆ *p*                                          
│ ◆ *buypremium*                                 
│ ◆ *runtime*                                     
│ ◆ *file*                                       
│ ◆ *script*                                      
│ ◆ *support*                                     
│ ◆ *owner*                                       
╰──────────────────╯ ${readmore}
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭───[ \`𝐁𝐔𝐆 𝐀𝐍𝐃𝐑𝐎𝐈𝐃\` ]────╮
│ ◆ *creepy-android*                             
│ ◆ *creepy-android2*                            
│ ◆ *creepy-uicrash*                            
│ ◆ *creepy-smash*                               
│ ◆ *killer-creepy*                             
│ ◆ *hacker-creepy*                              
│ ◆ *black-danny*                                
╰───────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭───[ \`𝐁𝐔𝐆 𝐖𝐄𝐁\` ]─────╮
│ ◆ *black-danny*                                
│ ◆ *black-dannygc*                             
│ ◆ *black-dannyios*                             
╰──────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭──[ \`𝐁𝐔𝐆 𝐈𝐎𝐒\` ]──────╮
│ ◆ *creepy-ios*                                 
│ ◆ *creepy-ios2*                                
│ ◆ *creepy-attack*                              
│ ◆ *black-dannyios*                             
│ ◆ *ios-creepy*                                  
╰─────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭───[ \`𝐁𝐔𝐆 𝐎𝐓𝐇𝐄𝐑\` ]─────╮
│ ◆ *tempban*                                    
│ ◆ *creepy-ban*                                 
│ ◆ *💀*                                        
│ ◆ *☠️*                                         
╰────────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭─[ \`𝐆𝐑𝐎𝐔𝐏 𝐁𝐔𝐆𝐒\` ]────╮
│ ◆ *group-death*                                
│ ◆ *black-dannygc*                              
│ ◆ *creepy-bug-group*                          
│ ◆ *creepy-gc*                                  
╰──────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭───[ \`𝐁𝐀𝐍/𝐔𝐍𝐁𝐀𝐍\` ]─────╮
│ ◆ *banv1*                                     
│ ◆ *banv2*                                     
│ ◆ *banv3*                                      
│ ◆ *banv4*                                     
│ ◆ *banv5*                                      
│ ◆ *banv6*                                      
│ ◆ *unbanv1*                                    
│ ◆ *unbanv2*                                   
│ ◆ *unbanv3*                                    
│ ◆ *unbanv4*                                    
│ ◆ *unbanv5*                                    
╰───────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭───[ \`𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔\` ]────╮
│ ◆ *getsession*                                
│ ◆ *deletesession*                             
│ ◆ *join*                                     
│ ◆ *shutdown*                                
│ ◆ *restart*                                     
│ ◆ *autoread [on/off]*                         
│ ◆ *autotyping [on/off]*                        
│ ◆ *autorecording [on/off]*                      
│ ◆ *autorecordtyp [on/off]*                   
│ ◆ *autoswview [on/off]*                      
│ ◆ *autobio [on/off]*                           
│ ◆ *mode [self/public]*                         
│ ◆ *block*                                      
│ ◆ *unblock*                                    
│ ◆ *backup*                                    
│ ◆ *getcase*                                   
│ ◆ *newomwner*                                 
│ ◆ *delowner*                                    
│ ◆ *creepy-open [viewonce]*                      
│ ◆ *autostatusreact*                             
╰─────────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭────[ \`𝐆𝐑𝐎𝐔𝐏 𝐌𝐄𝐍𝐔\` ]───╮
│ ◆ *closetime*                                 
│ ◆ *opentime*                               
│ ◆ *kick*                                   
│ ◆ *add*                                   
│ ◆ *promote*                                  
│ ◆ *demote*                                      
│ ◆ *setdesc*                                    
│ ◆ *tagall*                                      
│ ◆ *hidetag*                                    
│ ◆ *totag*                                     
│ ◆ *group [option]*                            
│ ◆ *editinfo*                                    
│ ◆ *linkgc*                                    
│ ◆ *revoke*                                     
│ ◆ *listonline*                                  
│ ◆ *antilink*                                   
╰──────────────────╯
> 𝓒𝓡𝓔𝓔𝓟𝓨_𝓜𝓓-𝓥𝟏 𝓬𝓻𝓮𝓪𝓽𝓮𝓭 𝓫𝓎 𝒟𝒶𝓃𝓃𝓎
╭────────────────────╮
│ ◆ *ytmp3 <link>*                              
│ ◆ *ytmp4 <link>*                               
│ ◆ *sound1 up to 161*                            
╰────────────────────╯
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃Commander \'${pushname}\'                    
┗━━━━━━━━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━━━┓
> To get file just type \`file\`                 
> New 2025 update                      
> Created by Danny🫡                   
> ©️Creepy technology                           
┗━━━━━━━━━━━━━━━━━━━━┛
`
                if (typemenu === 'v1') {
                    DannyTechInc.sendMessage(m.chat, {
                        text: creepmenuoh,
                        contextInfo: {
                            externalAdReply: {
                                title: botname,
                                body: ownername,
                                thumbnailUrl: 'https://files.catbox.moe/f6j3fl.jpeg',
                                sourceUrl: link,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {
                        quoted: m
                    })
                } else if (typemenu === 'v2') {
                    DannyTechInc.sendMessage(m.chat, {
                        video: fs.readFileSync('./GlobalMedia/thumb2.jpg'),
                        gifPlayback: false,
                        caption: creepmenuoh,
                        contextInfo: {
                            externalAdReply: {
                                title: botname,
                                body: ownername,
                                thumbnailUrl: 'https://files.catbox.moe/f6j3fl.jpeg',
                                sourceUrl: ``,
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, {
                        quoted: m
                    })
                } else if (typemenu === 'v3') {
                    DannyTechInc.sendMessage(m.chat, {
                        video: fs.readFileSync('./GlobalMedia/thumb2.jpg'),
                        caption: creepmenuoh,
                        gifPlayback: false
                    }, {
                        quoted: m
                    })
                } else if (typemenu === 'v4') {
                    DannyTechInc.relayMessage(m.chat, {
                        scheduledCallCreationMessage: {
                            callType: "AUDIO",
                            scheduledTimestampMs: 1200,
                            title: creepmenuoh
                        }
                    }, {})
                }
                break




}