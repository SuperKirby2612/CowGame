const DiscordJS = require('discord.js')
require('dotenv').config()
const WOKcommands = require('wokcommands')
const path = require('path')
const mongoose = require('mongoose')
const db = require('./db')
const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_PRESENCES,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_MEMBERS,
        DiscordJS.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        DiscordJS.Intents.FLAGS.DIRECT_MESSAGES,
        DiscordJS.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS
    ]
})

client.on('ready', () => {
    console.log(`Logged in as Cow Game#0257!`)
    client.user.setActivity('.help', {
        type: 'LISTENING',
       });
    new WOKcommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        featuresDir: path.join(__dirname, 'features'),
        botOwners: '695228246966534255',
        ignoreBots: true,
        testServers: ['907340495498407977', '760129849154338827'],
        mongoUri: process.env.MONGO_URI,
        ephemeral: true,
        delErrMsgCooldown: 3
    })
    .setDefaultPrefix('.')
})

client.login(process.env.DISCORD_TOKEN)