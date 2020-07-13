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
        let memberIndex = undefined;
        for (i = 0; i < data.length; i++) {
            if (data[i].id == message.member.id) {
                memberIndex = i;
            }
        }
        /**
         * If user not in json file, return blank
         */
        if (memberIndex == undefined)
        {
            message.channel.send({embed: {
                color: colors.GOLD,
                description: `**${message.member.displayName}'s Balance:**
                <:silvercoin:732299457428848732> 0
                <:goldcoin:732296673019035721> 0`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch();
        }
        else 
        {
            message.channel.send({embed: {
                color: colors.GOLD,
                description: `**${message.member.displayName}'s Balance:**
                <:silvercoin:732299457428848732> ${data[memberIndex].silver_bal}
                <:goldcoin:732296673019035721> ${data[memberIndex].gold_bal}`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch();
        }
    }
}    
    
    
