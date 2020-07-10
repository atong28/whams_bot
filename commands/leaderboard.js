module.exports = {
	name: 'leaderboard',
	description: 'Sends a leaderboard message ordered as specified.',
	execute(message, args, Discord, client) {

        /**
         * Initializes general data variables
         */
        const data = require("./../counter.json");

        if (args.length === 0) {
            message.channel.send({embed: {
                color:16711680,
                description: `You need to specify the ordering!
                
                Possible orderings:
                1 - Successful WHAM! Attempts
                2 - Failed WHAM! Attempts
                3 - WHAMs taken
                4 - WHAMs dodged
                5 - Total WHAM! Attack Attempts
                6 - Total WHAM! Receiving Attempts`
            }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
            message.react("🚫");
            return;
        }
        let str = ``;
        switch (args[0]) {
            case "1":
                data.sort((a, b) => (a.successful_whams < b.successful_whams) ? 1 : (a.successful_whams === b.successful_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].successful_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`Successful WHAMs Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            case "2":
                data.sort((a, b) => (a.failed_whams < b.failed_whams) ? 1 : (a.failed_whams === b.failed_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    console.log("Count: "+i);
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].failed_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`Failed WHAMs Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            case "3":
                data.sort((a, b) => (a.hit_whams < b.hit_whams) ? 1 : (a.hit_whams === b.hit_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].hit_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`WHAMs Taken Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            case "4":
                data.sort((a, b) => (a.dodge_whams < b.dodge_whams) ? 1 : (a.dodge_whams === b.dodge_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].dodge_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`WHAMs Dodged Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            case "5":
                data.sort((a, b) => (a.failed_whams+a.successful_whams < b.failed_whams+b.successful_whams) ? 1 : (a.failed_whams+a.successful_whams === b.failed_whams+b.successful_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].successful_whams+data[i].failed_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`Attacking WHAMs Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            case "6":
                data.sort((a, b) => (a.hit_whams+a.dodge_whams < b.hit_whams+b.dodge_whams) ? 1 : (a.hit_whams+a.dodge_whams === b.hit_whams+b.dodge_whams) ? ((message.guild.members.cache.get(a.id).displayName < message.guild.members.cache.get(b.id).displayName) ? 1 : -1) : -1 )
                for (i = 0; i < 10; i++) {
                    if (i == data.length) break;
                    str += `${i+1}. ${message.guild.members.cache.get(data[i].id).displayName} (${data[i].hit_whams+data[i].dodge_whams})\n`;
                }
                message.channel.send({embed: {
                    color:16711680,
                    title:`Receiving WHAMs Leaderboard`,
                    description:`${str}`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                break;
            default:
                message.channel.send({embed: {
                    color:16711680,
                    description: `You need to specify a valid ordering!
                    
                    Possible orderings:
                    1 - Successful WHAM! Attempts
                    2 - Failed WHAM! Attempts
                    3 - WHAMs taken
                    4 - WHAMs dodged
                    5 - Total WHAM! Attack Attempts
                    6 - Total WHAM! Receiving Attempts`
                }}).then(msg => {msg.delete({timeout: 30000})}).catch( console.log("hehe"));
                message.react("🚫");
                return;
        }

        message.react("✅");
    } 
}
