"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriber = exports.publisher = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const client = new ioredis_1.default(REDIS_URL);
exports.publisher = new ioredis_1.default(REDIS_URL);
exports.publisher.on("connect", () => {
    console.log("Publisher connected");
});
exports.publisher.on('error', (err) => {
    console.log(`Error occured while connecting to the publisher ${exports.publisher}`);
});
exports.subscriber = new ioredis_1.default(REDIS_URL);
exports.subscriber.on("connect", () => {
    console.log("Subscriber connected successfully");
});
exports.subscriber.on('error', (err) => {
    console.log(`Error occured while connecting to the subscriber ${err}`);
});
exports.default = {
    publisher: exports.publisher,
    subscriber: exports.subscriber,
    client
};
