"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubManager = void 0;
const redis_1 = require("./redis/redis");
class PubSubManager {
    constructor() {
        this.roomsDetails = new Map();
        redis_1.subscriber.on('message', (channel, message) => {
            this.forwardMessageToUsers(channel, message);
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new PubSubManager();
        }
        return this.instance;
    }
    AddRoomsToTheMap(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const findRoom = this.roomsDetails.has(roomId);
            if (!findRoom) {
                this.roomsDetails.set(roomId, new Set());
                yield redis_1.subscriber.subscribe(roomId);
            }
            (_a = this.roomsDetails.get(roomId)) === null || _a === void 0 ? void 0 : _a.add(userId);
        });
    }
    RemoveUserFromRoom(roomId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.roomsDetails.get(roomId);
            if (!users) {
                return;
            }
            users.delete(userId);
            if (users.size === 0) {
                redis_1.subscriber.unsubscribe(roomId);
                this.roomsDetails.delete(roomId);
            }
        });
    }
    forwardMessageToUsers(roomId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.roomsDetails.get(roomId);
            if (!users) {
                return;
            }
            users === null || users === void 0 ? void 0 : users.forEach((u) => {
                console.log(`Message sent to the users in the room ${roomId}`);
            });
        });
    }
}
exports.PubSubManager = PubSubManager;
const PubSubObject = PubSubManager.getInstance();
exports.default = PubSubObject;
