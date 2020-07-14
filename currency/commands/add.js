module.exports = {
    name: "add",
    description: "Adds a specified currency to the user. Available only for Whams and relay400",
	execute(message, args, Discord, client) {
        
        /**
         * Imports
         */
        const colors = require("../../colors.json");
    
    
        /**
         * Check if the user is Whams or relay400
         */
        if (message.member.id != "321108985346261002" && message.member.id != "214796172315983872") {
            message.channel.send({embed: {
                description: `You can't do that here.`
            }})
            message.react("🚫")
            return;
        };

        let command = undefined;
        /**
         * Check the first arg (silver / gold), then call addgold/addmoney from shopActions folder
         */

        
        switch (args[0]) { // idek what this is so xd ig
            case "gold":
                command = require(`./shopActions/addgold.js`);
                command.execute(message, args.slice(1), Discord, client);
                break;
            case "silver":
                command = require(`./shopActions/addmoney.js`);
				command.execute(message, args.slice(1), Discord, client);
                break;
            default:
                message.channel.send({embed: {
                    description: `First arg must be gold or silver.`
                }})
                message.react("🚫")
                return;
        }
    }
} 