module.exports = {
	execute(message, args, Discord, client) {


        const colors = require("../../../colors.json");
		const data = require("../../json/accounts.json"); 
		const prices = require("../../json/itemshop.json");
		const fs = require("fs"); 		

        if (args.length < 2)
        {
            message.channel.send({embed:{
                color: colors.RED,
                description: `Missing arguments. You need to include a member and an amount to give.`
            }})
            return;
        }

        if (isNaN(args[args.length-1])) {
            message.channel.send({embed:{
                color: colors.RED,
                description: `Usage: w!addmoney <user> <amount>`
            }});
            return;
        }


        if (!isNaN(args[0])) {
            message.channel.send({embed:{
                color: colors.RED,
                description: `Usage: w!addmoney <user> <amount>`
            }});
            return;
        }
        
        let mem = undefined;
        
        if (message.mentions.members.size < 1)
        {
            argStr = "";
            for (i = 0; i < args.length-1; i++)
            {
                argStr += args[i];
            }
            mem = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));
            try {
                mem.roles
            }
            catch (error) {
                console.log(error);
                message.react("❓");
                return;
            }
        }
        else
        {
            mem = message.mentions.members.first();
        }
        /**
         * Find user and create new account if not present
         */
        memberIndex = data.findIndex(ind => ind.id == mem.id);
        if (memberIndex == -1)
        {
            newAccount = {
                id: mem.id,
                silver_bal: 0,
                gold_bal: 0,
            }
            data.push(newAccount);
            memberIndex = data.length-1;
        }
        data[memberIndex].silver_bal += parseInt(args[args.length-1]);
        message.channel.send({embed: {
            color: colors.GOLD,
            description: `Added ${parseInt(args[args.length-1])} <:silvercoin:732299457428848732> to ${mem.displayName}'s balance.\nNew balance: ${data[memberIndex].silver_bal}<:silvercoin:732299457428848732>`
        }}).then(msg => msg.delete({timeout: 10000}).catch());
        

        /**
         * Saving
         */
	
		fs.writeFile("currency/json/accounts.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		});

	}
}
