module.exports = {
	name: 'bal',
	description: "Get a user's balance.",
	execute(message, args, Discord, client) {

		/**
         * Initializes general data variables
         */
        const colors = require("../colors.json");
		const data = require("./accounts.json");
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
         * If user not in json file, push a new blank profile
         */
        if (memberIndex == undefined)
        {

        }
            
        {
            message.reply({embed: {
                color: colors.GOLD,
                description: `**${message.member.displayName}'s Balance:**`
            }});
    }
}
        