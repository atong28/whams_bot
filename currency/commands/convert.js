module.exports = {
	name: 'convert',
	description: 'Convert 1 gold => 100 silver.',
	execute(message, args, Discord, client) {


        const colors = require("../../colors.json");
		const data = require("../json/accounts.json"); 
		const prices = require("../json/itemshop.json");
        const fs = require("fs"); 		
        
        if (args.length < 1)
        {
            message.channel.send({embed: {
                color: colors.RED,
                description: `You must select how much <:goldcoin:732296673019035721> you want to convert.`
            }}).then(msg => msg.delete({timeout: 10000}).catch());
            return;
        }
        
        try {
            parseInt(args[0]);
        }
        catch {
            message.channel.send({embed: {
                color: colors.RED,
                description: `You must select a number.`
            }}).then(msg => msg.delete({timeout: 10000}).catch());
        }

        memberIndex = data.findIndex(ind => ind.id == message.member.id);
        if (memberIndex == -1)
        {
            message.channel.send({embed: {
                color: colors.RED,
                description: `You don't have any <:goldcoin:732296673019035721> to convert.`
            }}).then(msg => msg.delete({timeout: 10000}).catch());
            return;
        }
        else
        {
            data[memberIndex].gold_bal -= parseInt(args[0]);
            data[memberIndex].silver_bal += 100*parseInt(args[0]);
            message.channel.send({embed: {
                color: colors.PURPLE,
                description: `You converted ${args[0]}<:goldcoin:732296673019035721> into ${100*parseInt(args[0])}<:silvercoin:732299457428848732>.`
            }}).then(msg => msg.delete({timeout: 10000}).catch());
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
