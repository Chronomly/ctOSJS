const QuickBot = require('./quickbot.js');
const { RichEmbed } = require('discord.js');
const config = require('./config.json');
const client = new QuickBot({
    owner: '251383432331001856',
    token: config.token,
    database: './database.json'
});
const prefix = config.prefix;
const bannedWords = ['dab'];

function reportCrime(message, user, crimeData) {
    console.log(crimeData)
    const embed = new RichEmbed()
    .setAuthor('Crime Detected!', client.user.avatarURL)
    .setThumbnail(user.avatarURL)
    .setDescription(`CrimeType: ${crimeData.crimeType}\nInfo on **${user.tag}** (ID: ${user.id})`)
    .setColor('0x0000FF')
    .addField('🚶 **User Info:**', `Created at: ${user.createdAt}\n${user.bot ? 'Account Type: Bot' : 'Account Type: User'}\nStatus: ${user.presence.status}\nGame: ${user.presence.game ? user.presence.game.name : 'None'}`)
    .setFooter(`Powered by ${client.user.username}`)
    .setTimestamp();
    if(crimeData.int > 3) {
        embed.addField('Crime Int', `${crimeData.int}\nMAX INT`)
        client.settings.set(user.id, 'MAX');
    } else {
        embed.addField('Crime Int', `${crimeData.int}`)
        client.settings.set(user.id, `${crimeData.int}`);
    }
    message.channel.send({embed: embed})
}

client.on('ready', () => {
    console.log(client.settings.get(client.owner.id)+1)
})

client.on('message', msg => {
    function badwordDetect(msg) {
        bannedWords.map((word) => {
            if(msg.content.includes(word)) {
                reportCrime(msg, msg.author, {
                    crimeType: "bannedWord",
                    int: Number(client.settings.get(msg.author.id))+1
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
        case "mod" :
            if(msg.author.id = client.owner.id) {
                if(args[0] = 'set') {
                    if(args.join(' ') === "") return msg.reply('')
                    client.settings.set(args[1], args[2])
                    msg.reply(client.settings.get('hi'))
                }
            } else {
                msg.reply('no u')
            }
            break;
    }
})