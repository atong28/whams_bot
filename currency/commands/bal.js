module.exports = {
	name: 'bal',
	description: "Get a user's balance.",
	execute(message, args, Discord, client) {

		/**
         * Initializes general data variables
         */
        const colors = require("../../colors.json");
		const data = require("../json/accounts.json");
		const fs = require("fs"); 

        /**
         * Searching for the author's account in json file
         */
        let mem = undefined;
        if (args.length == 0) {
            mem = message.member;
        } else {

            if (message.mentions.members.size < 1)
            {
                argStr = "";
                for (i = 0; i < args.length; i++)
                {
                    argStr += args[i];
                }
                mem = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));
                try {
                    mem.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
            }
            else
            {
                mem = message.mentions.members.first();
            }
        }

    
        memberIndex = data.findIndex(ind => ind.id == mem.id);
        /**
         * If user not in json file, return blank
         */
        if (memberIndex == -1)
        {
            message.channel.send({embed: {
                color: colors.GOLD,
                description: `**${mem.displayName}'s Balance:**
                <:silvercoin:732299457428848732> 0
                <:goldcoin:732296673019035721> 0`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch();
        }
        else 
        {
            message.channel.send({embed: {
                color: colors.GOLD,
                description: `**${mem.displayName}'s Balance:**
                <:silvercoin:732299457428848732> ${data[memberIndex].silver_bal}
                <:goldcoin:732296673019035721> ${data[memberIndex].gold_bal}`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch();
        }
    }
}    
    
    
