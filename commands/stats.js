module.exports = {
	name: 'stats',
	description: 'Checks your WHAM! stats.',
	execute(message, args, Discord, client) {
        const data = require("./../counter.json");
        let person = message.member;
        if (args.length === 0) {
            const WHAMER = "730251287219929170";
            const WHAMED = "730251299140009988";
            
            message.react('✅');
        }
        else {
            let check = undefined;

            let argStr = "";
            for (i = 0; i < args.length; i++) {
                argStr += args[i];
            }
            console.log(argStr);


            if (message.mentions.members.size < 1)
            {
                check = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

                try {
                    check.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
                person = check;
            }
            else
            {
                check = message.mentions.members.first();
                person = check;
            }

            
        }
        console.log(`Now logging ${person.displayName}'s stats.`);
        let index = undefined;

        for (i = 0; i < data.length; i++) {
            if (data[i].id == person.id) {
                index = i;
            }
        }

        if (index == undefined) {
            console.log(`Stats could not be found in JSON, giving default file.`);
            message.channel.send({embed: {
                color:16711680,
                title: `${person.displayName}'s Stats`,
                description: `You have successfully WHAM!ed people 0 times.
            You failed to WHAM! people 0 times.
            You dodged a WHAM! 0 times.
            You were hit by a WHAM! 0 times.`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));;
        } else {
            console.log(`Stats were logged successfully.`);
            message.channel.send({embed: {
                color:16711680,
                title: `${person.displayName}'s Stats`,
                description: `You have successfully WHAM!ed people ${data[index].successful_whams} times.
            You failed to WHAM! people ${data[index].failed_whams} times.
            You dodged a WHAM! ${data[index].dodged_whams} times.
            You were hit by a WHAM! ${data[index].hit_whams} times.`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));;
        }
        message.react('✅');
        
        
    }
}
