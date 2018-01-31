const discord = require('discord.js');
const JSONDatabase = require('./chrono-db.js');

module.exports = class Bot extends discord.Client {
    constructor(options) {

        super(options.clientOptions);

        this.settings = new JSONDatabase(options.database);

        this.once('ready', () => this.owner = this.users.get(options.owner));

        this.login(options.token)
    }
}