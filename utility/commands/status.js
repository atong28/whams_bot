const ms = require('ms');

module.exports = { 
    name: "status",
    description: "Check uptime and status of client",
    execute (message, args, Discord, client) {
        message.channel.send(`Client uptime is \`${ms(client.uptime, {long:true})}\``);
    }

}
        