module.exports = {
	name: 'pay',
	description: 'Pay someone.',
	execute(message, args, Discord, client) {


        const colors = require("../../colors.json");
		const data = require("../json/accounts.json"); 
		const prices = require("../json/itemshop.json");
		const fs = require("fs"); 		

        if (message.member.id == "321108985346261002" || message.member.id == "214796172315983872")
        {
            if (args.length < 2)
            {
                message.channel.send({embed:{
                    color: colors.RED,
                    description: `Missing arguments. You need to include a member and an amount to give.`
                }})
            }


            if (!isNaN(args[0])) {
                message.channel.send({embed:{
                    color: colors.RED,
                    description: `Usage: w!pay <user> <amount>`
                }});
                return;
            }
            
            let mem = undefined;
            
            if (message.mentions.members.size < 1)
            {
                console.log(`no mention`);
                argStr = "";
                for (i = 0; i < args.length-1; i++)
                {
                    argStr += args[i];
                }
                mem = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));
                console.log(mem);
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
                console.log(`mention`);
                mem = message.mentions.members.first();
            }
            /**
             * Find user and create new account if not present
             */
            userIndex = data.findIndex(ind => ind.id == message.member.id);
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
            if (userIndex == -1)
            {
                newAccount = {
                    id: mem.id,
                    silver_bal: 0,
                    gold_bal: 0,
                }
                data.push(newAccount);
                userIndex = data.length-1;
            }
            console.log(`found member ${mem.displayName} at index ${memberIndex}`);
            if (data[userIndex].silver_bal < args[args.length-1])
            {
                message.channel.send({embed: {
                    color: colors.RED,
                    description: `You don't have enough to pay that much.
                    You have: ${data[userIndex].silver_bal}<:silvercoin:732299457428848732>`
                }}).then(msg => msg.delete({timeout: 10000}).catch());
                return;
            }
            data[memberIndex].silver_bal += parseInt(args[args.length-1]);
            data[userIndex].silver_bal -= parseInt(args[args.length-1]);
            message.channel.send({embed: {
                color: colors.GOLD,
                description: `Gave ${parseInt(args[args.length-1])} <:silvercoin:732299457428848732> to ${mem.displayName}.\nYour new balance: ${data[userIndex].silver_bal}`
            }}).then(msg => msg.delete({timeout: 10000}).catch());
        }
        else
        {
            message.channel.send({embed: {
                color: colors.RED,
                description: `You can't do that. Were you trying to use the pay command?`
            }})
            message.react("🚫");
        }
        

        /**
         * Saving
         */
	
		fs.writeFile("currency/json/accounts.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		});

	}
}
