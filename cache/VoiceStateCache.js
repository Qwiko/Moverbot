"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const BaseCache_1 = __importDefault(require("./BaseCache"));
class VoiceStateCache extends BaseCache_1.default {
    constructor(storageEngine, rain, boundObject) {
        super(rain);
        this.namespace = "voicestates";
        this.storageEngine = storageEngine;
        if (boundObject)
            this.bindObject(boundObject);
    }
    async get(id, guildId) {
        var _a;
        if (id === void 0) { id = (_a = this.boundObject) === null || _a === void 0 ? void 0 : _a.user_id; }
        if (this.boundObject)
            return this;
        const state = await this.storageEngine.get(this.buildId(id));
        if (!state)
            return null;
        return new VoiceStateCache(this.storageEngine, this.rain, state);
    }
    async update(id, guildId, data) {
        delete data.member;
        if (!data.guild_id)
            data.guild_id = guildId;
        if (this.boundObject)
            this.bindObject(data);
        await this.addToIndex(id);
        await this.storageEngine.upsert(this.buildId(id), this.structurize(data));
        if (this.boundObject)
            return this;
        return new VoiceStateCache(this.storageEngine, this.rain, data);
    }
    async remove(id, guildId) {
        var _a;
        if (id === void 0) { id = (_a = this.boundObject) === null || _a === void 0 ? void 0 : _a.user_id; }
        await this.removeFromIndex(id);
        return this.storageEngine.remove(this.buildId(id));
    }
    async filter(fn, ids = undefined) {
        const states = await this.storageEngine.filter(fn, ids, this.namespace);
        return states.map(s => new VoiceStateCache(this.storageEngine, this.rain, s));
    }
    async find(fn, ids = undefined) {
        const state = await this.storageEngine.find(fn, ids, this.namespace);
        if (!state)
            return null;
        return new VoiceStateCache(this.storageEngine, this.rain, state);
    }
    bindUserId(userId) {
        this.user_id = userId;
        return this;
    }
    async addToIndex(id) {
        return this.storageEngine.addToList(this.namespace, id);
    }
    async removeFromIndex(id, guildId) {
        return this.storageEngine.removeFromList(this.namespace, this.buildId(id));
    }
    async isIndexed(id, guildId) {
        return this.storageEngine.isListMember(this.namespace, this.buildId(id));
    }
    async getIndexMembers() {
        return this.storageEngine.getListMembers(this.namespace);
    }
    async removeIndex() {
        return this.storageEngine.removeList(this.namespace);
    }
    async getIndexCount() {
        return this.storageEngine.getListCount(this.namespace);
    }
    buildId(userId, guildId) {
        if (!guildId)
            return super.buildId(userId);
        return `${this.namespace}.${guildId}.${userId}`;
    }
}
module.exports = VoiceStateCache;
