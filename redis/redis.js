
const redis = require('redis')

let redisClient 
(async () => {
  redisClient = redis.createClient({
    password: '54O2hazEfJbtEVfb6am1V10IHe277kRl',
    socket: {
        host: 'redis-16829.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 16829
    }
});
redisClient.on("error", (error) => console.log(error))
await redisClient.connect()
})()


module.exports = redisClient