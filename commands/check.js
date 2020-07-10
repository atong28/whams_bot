module.exports = {
	name: 'check',
	description: 'Checks to see if you are a WHAMER, WHAMED, or NEITHER.',
	execute(message, args, Discord, client) {

        /**
         * Initializes general data variables
         */
        const data = require("./../counter.json");
        const WHAMER = "730251287219929170";
        const WHAMED = "730251299140009988";
        let whammerIndex = undefined;
        let check = undefined;

        /**
         * This if statement is enabled when there are no arguments, running check on the user who ran the command.
         * Else statement: arguments are provided.
         */
        if (args.length === 0) {

            /**
             * Finds index of the user
             */
            for (i = 0; i < data.length; i++) {
                if (data[i].id == message.member.id) {
                    whammerIndex = i;
                }
            }
            check = message.member;
        }
        else {

            /**
             * Condenses the arguments together into one string (no spaces)
             */
            let argStr = "";
            for (i = 0; i < args.length; i++) {
                argStr += args[i];
            }

            /**
             * Finds the guild member
             * if: no mentions
             * else: mentioned
             */
            if (message.mentions.members.size < 1)
            {
                check = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

                /**
                 * Test that the person found is defined, otherwise return question mark
                 */
                try {
                    check.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
            }
            else
            {
                check = message.mentions.members.first();
            }

            /**
             * Find index in data
             */
            for (i = 0; i < data.length; i++) {
                if (data[i].id == check.id) {
                    whammerIndex = i;
                }
            }
        
        }
        /**
         * Send stats
         */
        if (check.roles.cache.has(WHAMER)) {
            message.channel.send(`${check.displayName} has ${data[whammerIndex].wham_tokens} tokens!`)
            .then(msg => {msg.delete({timeout: 10000})}).catch();
        } else if (check.roles.cache.has(WHAMED)) {
            message.channel.send(check.displayName+" is WHAMED!")
            .then(msg => {msg.delete({timeout: 10000})}).catch();
        } else {
            message.channel.send(check.displayName+" is not WHAMED nor a WHAMER. Type more in chat to get a wham charge!")
            .then(msg => {msg.delete({timeout: 10000})}).catch();
        }
        message.react('✅');
            
        
        
    }
}
