module.exports = {
	name: 'buy',
	description: 'Buy an item from the shop.',
	execute(message, args, Discord, client) {


        const colors = require("../colors.json");
		const data = require("./accounts.json");
		const fs = require("fs"); 		
        

        /**
         * Find user and create new account if not present
         */
		let memberIndex = undefined;
		for (i = 0; i < data.length; i++) {
			if (data[i].id == message.member.id) {
				memberIndex = i;
			}
		}
		if (memberIndex == undefined)
		{
			message.reply({embed: {
                color: colors.RED,
                description: `First, create a profile using w!createaccount.`
            }})
            message.react("⚠️");
		}
        


        /**
         * Saving
         */
		fs.writeFile("./accounts.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		});
	}
}
