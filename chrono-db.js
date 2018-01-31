const fs = require('fs');

module.exports = class JSONDatabase {
    constructor(path) {
        this.path = path;
        this._store = {};
    }

    async sync() {
        let database = await fs.readFileSync(this.path, 'utf8');

        if (!database) {
            await fs.writeFileSync(this.path, await this.serialize({}));
            database = {};
        } else {
            database = await this.deserialize(database);
        }

        this._store = Object.assign(database, this._store);

        await fs.writeFileSync(this.path, await this.serialize(this._store))

        return true;
    }

    async get(key) {
        this.sync();

        if (!!this._store[key] === false) {
            return undefined;
        } else {
            return this._store[key];
        }
    }

    async set(key, value) {
        this._store[key] = value;

        this.sync();

        if (this._store[key] !== value) {
            throw `Error! ${key} was not successfully set to ${value}`;
        }

        return value;
    }

    async serialize(data) {
        return JSON.stringify(data, null, 2);
    }

    async deserialize(data) {
        return JSON.parse(data);
    }
}