module.exports = {
	name: 'bal',
	description: "Get a user's balance.",
	execute(message, args, Discord, client) {

		/**
         * Initializes general data variables
         */
		const data = require("accounts.json");
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
            let newWhammed = {
                id:message.member.id,
                bal: 0
            }
            data.push(newAccount); // push blank profile and find it again
            whammerIndex = data.length-1;
        }

        message.react("✅");
        message.reply({embed: {
            color: 15844367,
            description: `**${message.member.displayName}'s Balance:** ${data[memberIndex].bal}`
        }})
        fs.writeFile("wham_game/counter.json", JSON.stringify(data), err => { 
            // Checking for errors 
            if (err) throw err;  
        });
    }
}
