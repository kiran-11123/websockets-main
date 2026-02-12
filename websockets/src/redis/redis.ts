import redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';


const client  = new redis(REDIS_URL);


export const publisher = new redis(REDIS_URL);

publisher.on("connect" , ()=>{
     console.log("Publisher connected")
})

publisher.on('error' ,(err)=>{
     console.log(`Error occured while connecting to the publisher ${publisher}`)
})

export const subscriber = new redis(REDIS_URL);

subscriber.on("connect" , ()=>{
    console.log("Subscriber connected successfully")
})

subscriber.on('error'  , (err)=>{
    console.log(`Error occured while connecting to the subscriber ${err}`);
})


export default {
    publisher,
    subscriber,
    client
};