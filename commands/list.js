module.exports = {
	name: 'list',
	description: 'Lists the people that are either WHAMED, WHAMER, or neither.',
	execute(message, args, Discord, client) {

        /**
         * Initializes general data variables
         */
        const data = require("./../counter.json");
        const guild = message.guild;
        const WHAMER = "730251287219929170";
        const WHAMED = "730251299140009988";
        const WHAMER_ROLE = guild.roles.cache.get(WHAMER);
        const WHAMED_ROLE = guild.roles.cache.get(WHAMED);
        const fs = require("fs"); 
        let str = "People that are ";
        if (args.length === 0) {
            message.reply(`you need to specify which list you'd like to see!
            Options: whamed, whamer, neither`)
            return;
        }
        if (args[0].toLowerCase() === "whamed") {
            str += "whamed: ";
            const WHAMED_MEMBERS_ARRAY = WHAMED_ROLE.members.array();
            if (WHAMED_MEMBERS_ARRAY.length === 0) {
                message.channel.send({embed: {
                    description: `Error: there are no people whamed.`
                }}).then(msg => {msg.delete({timeout: 20000})}).catch( console.log("hehe"));
                return;
            }
            for (i = 0; i < WHAMED_MEMBERS_ARRAY.length-1; i++) {
                str += WHAMED_MEMBERS_ARRAY[i].displayName+", ";
            }
            str += WHAMED_MEMBERS_ARRAY[WHAMED_MEMBERS_ARRAY.length-1].displayName;
        } else if (args[0].toLowerCase() === "whamer") {
            str += "whamers: ";
            const WHAMER_MEMBERS_ARRAY = WHAMER_ROLE.members.array();
            if (WHAMER_MEMBERS_ARRAY.length === 0) {
                message.channel.send({embed: {
                    description: `Error: there are no whamers.`
                }}).then(msg => {msg.delete({timeout: 20000})}).catch( console.log("hehe")); 
                return;
            }
            for (i = 0; i < WHAMER_MEMBERS_ARRAY.length-1; i++) {
                str += WHAMER_MEMBERS_ARRAY[i].displayName+", ";
            }
            str += WHAMER_MEMBERS_ARRAY[WHAMER_MEMBERS_ARRAY.length-1].displayName;
        } else if (args[0].toLowerCase() === "neither") {
            str += "neither: ";
            const MEMBERS_ARRAY = guild.members.cache.array();
            for (i = 0; i < MEMBERS_ARRAY.length-1; i++) {
                if (!MEMBERS_ARRAY[i].roles.cache.has(WHAMER) && !MEMBERS_ARRAY[i].roles.cache.has(WHAMED)) {
                    str += MEMBERS_ARRAY[i].displayName+", ";
                }
            }
            if (!MEMBERS_ARRAY[MEMBERS_ARRAY.length-1].roles.cache.has(WHAMER) && !MEMBERS_ARRAY[MEMBERS_ARRAY.length-1].roles.cache.has(WHAMED)) {
                str += MEMBERS_ARRAY[MEMBERS_ARRAY.length-1].displayName;
            }
        } else {
            message.react("🚫");
            message.reply("I did not understand your arguments. Please use: w!list [WHAMED/WHAMER/NEITHER]").then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));;
            return;
        }
        message.reply(str).then(msg => {msg.delete({timeout: 20000})}).catch( console.log("hehe"));
        message.react('✅');
    }
}
