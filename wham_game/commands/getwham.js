module.exports = {
	name: 'getwham',
	description: 'Obtain a wham charge.',
	execute(message, args, Discord, client) {

		/**
         * Initializes general data variables
         */
		const WHAMED = "730251299140009988";
		const WHAMER = "730251287219929170";
		const data = require("../json/counter.json");
		const fs = require("fs"); 

		/**
		 * Allows access to Whams and relay400 only.
		 */
		if (message.author.id == "321108985346261002" || message.author.id == "214796172315983872")
		{
			if (message.member.roles.cache.has(WHAMED)) {
				message.member.roles.remove(WHAMED);
				return;
			}
			/**
			 * Searching for the author's stats in json file
			 */
			let whammerIndex = undefined;
			for (i = 0; i < data.length; i++) {
				if (data[i].id == message.member.id) {
					whammerIndex = i;
				}
			}
			/**
			 * If user not in json file, push a new blank profile
			 */
			if (whammerIndex == undefined)
			{
				let newWhammed = {
					id:message.member.id,
					successful_whams:0,
					failed_whams:0,
					dodged_whams:0,
					hit_whams:0,
					wham_tokens:1
				}
				data.push(newWhammed); // push blank profile and find it again
				whammerIndex = data.length-1;
			}
			
			if (message.member.roles.cache.has(WHAMER)) {
				// do nothing
			} else {
				message.member.roles.add(WHAMER); // give WHAMER role, since token count will necessarily
				                                  // be positive
			}
			data[whammerIndex].wham_tokens += 1; // give the user a token

			message.react("✅");
			fs.writeFile("wham_game/json/counter.json", JSON.stringify(data), err => { 
				// Checking for errors 
				if (err) throw err;  
			});
		}
		else { // If you aren't Whams or relay400
			message.react("🚫");
		}
	}
}
