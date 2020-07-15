module.exports = {
	name: 'startgame',
    description: 'Starts the game.',
    aliases: ['sg','start'],
	execute(message, args, Discord, client) {
        const gameData = require("./game.json");
        const roleData = require("./roles.json");
        if (message.channel.parentID != "732742979701309532") {
            message.channel.send({embed: {
                description: "You are not in a mafia game! Navigate to your mafia game channel and retry with this command."
            }});
            return;
        }

        const gameNum = parseInt(message.channel.name.substring(6));
        if (message.member.id != gameData.gameData[gameNum-1].gameHead) {
            message.channel.send({embed: {
                description: "You are not the game head! If you believe you are, make sure you are in the right mafia channel."
            }});
            return;
        }

        /**
         * Role selection
         * roles[i] - .faction ("Town" / "Mafia") .roledm (String to be sent to players) 
         *                                        .name (String)
         * 0 - Townie                             
         * 1 - Cop
         * 2 - Doctor
         * 3 - Vigliante
         * 4 - Roleblocker
         * 5 - Tracker
         * 6 - Watcher
         * 7 - Innocent Child
         * 
         * 8 - Mafia Goon
         * 9 - Mafia Roleblocker
         * 10- Mafia Rolecop
         * 
         * 
         * 
         * SETUPS
         * 9P: {0, 0, 0, 0, 0, 1, 2, 8, 9}
         * 8P: {0, 0, 0, 1, 2, 3, 8, 9}
         * 7P: {0, 0, 0, 1, 2, 8, 8}
         * 6P: {0, 0, 0, 0, 2, 8}
         * 5P: {0, 0, 0, 0, 8}
         * 4P: {0, 0, 2, 8}
         * 3P: {0, 1, 8}
         */
        let setups = [[0, 1, 8], [0, 0, 2, 8], [0, 0, 0, 8], [0, 0, 0, 0, 2, 8], [0, 0, 0, 1, 2, 8, 8], [0, 0, 0, 1, 2, 3, 8, 9], [0, 0, 0, 0, 0, 1, 2, 8, 9]];
        message.channel.send({embed: {
            color: colors.ORANGE,
            description: `Starting game with ${numPlayers} players.`
        }})
        let roles = setups[numPlayers-3];
        let roleStr = "";
        for (i = 0; i < roles.length; i++)
        {
            roleStr += "(" + roleData[roles[i]].faction + ") " + roleData[roles[i]].name + "\n";
        }
        message.channel.send({embed: {
            color: colors.ORANGE,
            description: `Roles:\n${roleStr}`
        }})
    }
}