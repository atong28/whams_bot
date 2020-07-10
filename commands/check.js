module.exports = {
	name: 'check',
	description: 'Checks to see if you are a WHAMER, WHAMED, or NEITHER.',
	execute(message, args, Discord, client) {
        if (args.length === 0) {
            const WHAMER = "730251287219929170";
            const WHAMED = "730251299140009988";
            if (message.member.roles.cache.has(WHAMER)) {
                message.reply("you are a WHAMER!");
            } else if (message.member.roles.cache.has(WHAMED)) {
                message.reply("you are WHAMED!");
            } else {
                message.reply("you are not WHAMED nor a WHAMER. Type more in chat to get a wham charge!");
            }
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
                const noob = message.guild.members.cache.get("353605856471941134");

                check = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

                try {
                    check.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
            }
            else
            {
                check = message.mentions.members.first();
            }

            const WHAMER = "730251287219929170";
            const WHAMED = "730251299140009988";
            if (check.roles.cache.has(WHAMER)) {
                message.channel.send(check.displayName+" is a WHAMER!");
            } else if (message.member.roles.cache.has(WHAMED)) {
                message.channel.send(check.displayName+" is WHAMED!");
            } else {
                message.channel.send(check.displayName+"is not WHAMED nor a WHAMER. Type more in chat to get a wham charge!");
            }
            message.react('✅');
        }
        
    }
}
