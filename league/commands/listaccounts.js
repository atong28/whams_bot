module.exports = {
	name: 'listaccounts',
	description: 'Creates your league profile.',
	execute(message, args, Discord, client) {
        const profiles = require('./../profiles.json');

        /**
         * Parse Args
         * w!listaccounts <main/alt/all> <tag> 
         * w!listaccounts <main/alt/all> <display name>
         */

        if (args.length === 0) {
            message.channel.send({embed: {
                description: `${message.member.displayName}, you need to specify arguments!
                Usage: w!listaccounts <main/alt/all> <tag/displayname>`
            }});
            return;
        }
        
        let player = undefined;

        let mode = undefined;

        switch (args[0]) {
            case "main":
                mode = 0;
                break;
            case "alt":
                mode = 1;
                break;
            case "all":
                mode = 2;
                break;
            default:
                message.channel.send({embed: {
                    description: `${message.member.displayName}, you need to specify a valid type!
                    Usage: w!listaccounts <main/alt/all> <tag/displayname`
                }})
                return;
        }

        if (args.length === 1) {
            player = message.member;
        } else {
            /**
             * Combine args (no spaces)
             */
            let argStr = "";
            for (i = 1; i < args.length; i++) {
                argStr += args[i];
            }


            /**
             * Find member mentioned
             */
            if (message.mentions.members.size < 1)
            {
                player = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

                try {
                    player.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
            }
            else
            {
                player = message.mentions.members.first();
            }
        }

        let playerIndex = undefined;

        for (i = 0; i < profiles.length; i++) {
            if (profiles[i].discord_id == player.id) {
                playerIndex = i;
                break;
            }
        }

        const playerData = profiles[playerIndex];

        let str = "";
        switch (mode) {
            case 0:
                message.channel.send({embed: {
                    title: `${player.displayName}'s Main Account`,
                    description: `${playerData.league_username}`
                }})
                break;
            case 1:
                str = "";
                if (playerData.league_alts.length === 0) {
                    message.channel.send({embed: {
                        description: `${player.displayName} does not have any alt accounts linked!`
                    }})
                }
                for (i = 0; i < playerData.league_alts.length-1; i++) {
                    str += playerData.league_alts[i]+", ";
                }
                str += playerData.league_alts[playerData.league_alts.length-1];
                message.channel.send({embed: {
                    title: `${player.displayName}'s Alt Accounts`,
                    description: `${str}`
                }})
                break;
            case 2:
                str = playerData.league_username;
                for (i = 0; i < playerData.league_alts.length; i++) {
                    str += ", "+playerData.league_alts[i];
                }
                message.channel.send({embed: {
                    title: `${player.displayName}'s Accounts`,
                    description: `${str}`
                }})
                break;
        }
    }
}