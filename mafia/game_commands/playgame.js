module.exports = {
	name: 'playgame',
    description: 'Plays the game. Alternates between day/night phases.',
    aliases: ['play'],
	execute(message, Discord, client, players, roles) {
        const gameData = require("../game.json");
        const roleData = require("../roles.json");
        const colors = require ("../../colors.json")
        if (message.channel.parentID != "732742979701309532") {
            message.channel.send({embed: {
                description: "You are not in a mafia game! Navigate to your mafia game channel and retry with this command."
            }});
            return;
        }

        const gameNum = parseInt(message.channel.name.substring(6));
        const numPlayers = players.length;
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
         */
        
        let townCount = 0;
        let mafiaCount = 0;
        for (i = 0; i < roles.length; i++)
        {
            if (roleData[roles[i]].faction == "Town")
            {
                townCount++;
            }
            else if (roleData[roles[i]].faction == "Mafia")
            {
                mafiaCount++;
            }
        }

        let phaseNum = 0;
        const votes = [];
        for (i = 0; i < players.length; i++)
        {
            votes.push(null);
        }

        while (mafiaCount < townCount)
        {
            phaseNum++;
            message.channel.send({embed: {
                color: colors.DARK_GOLD,
                description: `**Day ${phaseNum}** has begun. The day will end when ${Math.floor((mafiaCount+townCount+1)/2)} votes for a player, ${Math.floor((mafiaCount+townCount+1)/2)} votes for nobody have been accumulated, or 10 minutes have elapsed.`
            }})

            const filter = m => (m.content.includes("Vote:") && m.mentions.members.size() > 0) || m.content.includes("Vote: Nobody");
            const collector = message.channel.createMessageCollector(filter, {time: 600000});

            /**
             * Collect votes for 10 minutes.
             * During that time:
             *  - When a vote is received, store it in the votes array (which stores GuildMembers).
             *  - 
             */
            collector.on('collect', m => {
                if (m.content.startsWith("m!vote"))
                {
                    let args = m.content.slice(6).split(/ +/);
                    if (args.length == 0) {
                        message.channel.send({embed: {
                            description: `You must specify who to vote for! If you want to vote for nobody, specify 'none'.`
                        }});
                    } else {
                        if (args[0] == `none`) {
                            console.log(`Collected a vote: ${m.member.displayName} votes for nobody.`)
                        }
                        //find person
                    }
                    
                }
            })
        }
    }
}