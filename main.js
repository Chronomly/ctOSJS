const QuickBot = require('./quickbot.js');
const { RichEmbed } = require('discord.js');
const config = require('./config.json');
const client = new QuickBot({
    owner: '251383432331001856',
    token: config.token,
    database: './database.json'
});
const db = require('./chrono-db.js');
client.settings = new db('./database.json')
console.log(client.settings)
const prefix = config.prefix;
const bannedWords = config.bannedWords;

function reportCrime(message, user, crimeData) {
    function crimeTypeParse(crimeType) {
        if(crimeType === 'bannedWord') {
            return 'User said a word banned in this server'
        }
    }
    crimeData.crimeType = crimeTypeParse(crimeData.crimeType)
    console.log(crimeData)
    const embed = new RichEmbed()
    .setAuthor('Crime Detected!', client.user.avatarURL)
    .setThumbnail(user.avatarURL)
    .setDescription(`Crime: ${crimeData.crimeType}\n\nInfo on **${user.tag}** (ID: ${user.id})\n`)
    .setColor('0x0000FF')
    .addField('🚶 **User Info:**', `Created at: ${user.createdAt}\n${user.bot ? 'Account Type: Bot' : 'Account Type: User'}\nStatus: ${user.presence.status}\nGame: ${user.presence.game ? user.presence.game.name : 'None'}`)
    .setFooter(`Powered by ${client.user.username}`)
    .setTimestamp();
    if(crimeData.int > 3) {
        embed.addField('Crime Int', `${crimeData.int}\nMAX INT`)
        client.settings.set(user.id, 'MAX');
    } else {
        embed.addField('Crime Int', `${crimeData.int}`)
        client.settings.set(user.id, Number(crimeData.int));
    }
    message.channel.send({embed: embed})
}

client.on('ready', async () => console.log(await client.settings.get('251383432331001856')));

client.on('message', msg => {
    function badwordDetect(msg) {
        bannedWords.map((word) => {
            if(msg.content.includes(word)) {
                reportCrime(msg, msg.author, {
                    crimeType: "bannedWord",
                    int: parseInt(client.settings.get(msg.author.id))+1
                })
                msg.delete()
                console.log(`Bad Word Detected:\n${word}\n${msg.author.tag + '/' + msg.author.id}`)
            }
        })
    }
    badwordDetect(msg)
    if(msg.author.bot) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(args)
    switch (command) {
        case "ping" :
            msg.channel.send('Pong!');
            break;
        case "upvoteme" :
            msg.react("👍")
            break;
        case "mod" :
            if(msg.author.id = client.owner.id) {
                if(args[0] = 'set') {
                    if(args.join(' ') === "") return msg.reply('Please enter arguments')
                    client.settings.set(args[1], args[2])
                    msg.reply(client.settings.get('hi'))
                }
                if(args[0] = 'ctOS') {
                    if(args.join(' ') === "") return msg.reply('Please enter arguments')
                    if(args[1] === 'enable') {
                        message.channel.send('Enabling ctOS for this server')
                    }
                    msg.reply(client.settings.get('hi'))
                }
            } else {
                msg.reply('no u')
            }
            break;
    }
})