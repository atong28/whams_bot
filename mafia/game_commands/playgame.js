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
        let votes = [];
        for (i = 0; i < players.length; i++)
        {
            votes.push("");
        }

        phaseNum++;
        message.channel.send({embed: {
            color: colors.DARK_GOLD,
            description: `**Day ${phaseNum}** has begun. The day will end when ${Math.floor((mafiaCount+townCount)/2)+1} votes for a player, ${Math.floor((mafiaCount+townCount+1)/2)} votes for nobody have been accumulated, or 10 minutes have elapsed.`
        }})

        const filter = m => (m.content.includes("Vote:") && m.mentions.members.size > 0) || m.content.includes("Vote: Nobody") || m.content.includes("Unvote");
        const collector = message.channel.createMessageCollector(filter, {time: 600000});

        /**
         * Collect votes for 10 minutes.
         * During that time:
         *  - When a vote is received, store it in the votes array (which stores GuildMembers).
         *  - votes require a ping and/or "Nobody"
         *  - 
         */
        collector.on('collect', m => {
            /**
             * Collects votes. procceses it by finding the member corresponding
             * to the players array and places the vote in the votes array
             * (essentially, players maps to votes)
             * 
             * //if ur gonna replace this all, you need to modify it so that the players array contains the votes and everything
             * players array contains guildmembers, so it should be fine for id?
             * you should be using a game array that contains the relevant info for the player in each object
             * not only should there be guildmember, but also the fact that you should include things like .vote, .role, etc
             * this way it's much easier to pass a single array and take hold of gamestate
             * it will help later on when you get into nightly actions
             * 
             * but doesn't two arrays of players and roles and votes do all of that already
             * but you can make it one array, without having to worry about anything weird like a player suddenly leaving the game
             * 
             * it's just much simpler and harder to make mistakes with
             * 
             * if (m.content.includes("Vote: Nobody")) {
             *     let index = players.findIndex(player => player.id == m.member.id);
             *     if (index == -1) {
             *          //handle did not find anybody
             *     } else {
             *          players[index].votes = "Nobody"
             *     }
             * }
             */
            if (m.content.includes("Vote: Nobody")) 
            {
                for (i = 0; i < players.length; i++)
                {
                    if (players[i] == m.member)
                    {
                        votes[i] = "Nobody";
                        console.log(`Collected a vote: ${m.member.displayName} votes for nobody.`)
                    }
                }
            }
            else if (m.content.includes("Unvote"))
            {
                for (i = 0; i < players.length; i++)
                {
                    if (players[i] == m.member)
                    {
                        votes[i] = "";
                    }
                }
            }
            else if (m.content.includes("Vote:"))
            {
                for (i = 0; i < players.length; i++)
                {
                    if (players[i] == m.member)
                    {
                        votes[i] = m.mentions.members.first();
                        //remember to handle the case that people can tag admins outside of the game
                    } 
                }       
                console.log(`Collected a vote: ${m.member.displayName} votes for ${m.mentions.members.first()}.`)
            }
            /**
             * Create vote string to send vote count
             */
            voteStr = "**Votes:**\n**Nobody** ";
            let voteCount = 0;
            let endPhaseNo = false;
            let endPhaseYes = false;
            let endPhaseIndex = -1;
            let noCount = 0;
            let tempStr = "";
            /**
             * Finds nobody votes first.
             */
            for (i = 0; i < votes.length; i++)
            {
                if (votes[i] == "Nobody")
                {
                    console.log(`${players[i].displayName} voted for Nobody.`)
                    tempStr += players[i].displayName + ", ";
                    noCount++;
                }
            }   
            if (noCount >= Math.floor((mafiaCount+townCount+1)/2))
            {  
                endPhaseNo = true;
            }
            voteStr += `(${noCount}): ${tempStr.substring(0, tempStr.length-2)}\n`;
            /**
             * Checks player:
             * 
             * Vote count looks like this:
             * 
             * Votes:
             * Nobody: (#) A, B, C
             * A: (#) D, E
             * etc. etc.
             */
            for (i = 0; i < players.length; i++)
            {
                voteCount = 0;
                voteStr += `**${players[i].displayName}** `;
                tempStr = "";
                for (j = 0; j < votes.length; j++)
                {
                    if (votes[j].displayName == players[i].displayName)
                    {
                        tempStr += players[j].displayName + ", ";
                        voteCount++;
                    }
                }
                voteStr += `(${voteCount}): ${tempStr.substring(0, tempStr.length-2)}\n`;
                if (voteCount >= Math.floor((mafiaCount + townCount)/2+1))
                {
                    endPhaseYes = true;
                    endPhaseIndex = i;
                }
            }

            message.channel.send({embed: {
                color: colors.YELLOW,
                description: `${voteStr}`
            }});

            if (endPhaseNo)
            {
                m.channel.send({embed: {
                    color: colors.DARK_PURPLE,
                    description: `A consensus has been reached. Day ${phaseNum} is now over.`
                }});
            }
            else if (endPhaseYes)
            {
                m.channel.send({embed: {
                    color: colors.DARK_PURPLE,
                    description: `A consensus has been reached. Day ${phaseNum} is now over.\n
                    ${players[endPhaseIndex].displayName} has been voted out.
                    They were a ${roleData[roles[endPhaseIndex]].name}.`
                }})
                if (roleData[roles[endPhaseIndex]].faction == "Town")
                {
                    townCount--;
                }
                else if (roleData[roles[endPhaseIndex]].faction == "Mafia")
                {
                    mafiaCount--; 
                }
                if (mafiaCount == 0)
                {
                    m.channel.send({embed: {
                        color: colors.GREEN,
                        description: `All mafia have been eliminated. The Town wins!`
                    }})

                    
                    let permissions = m.channel.permissionOverwrites;
                    console.log(permissions);
                    let index = permissions.findIndex(perm => perm.id == m.guild.id);
                    if (index == -1) {
                        console.log('error, could not find global perm');
                    } else {
                        permissions[index] = {
                            id: m.guild.id,
                            allow: ['SEND_MESSAGES']
                        };
                        m.channel.overwritePermissions(permissions);
                    }
                    
                    return;
                }
                else if (mafiaCount >= townCount)
                {
                    m.channel.send({emed: {
                        color: colors.RED,
                        description: `The mafia outnumber the town. The Mafia win!`
                    }})
                    let permissions = m.channel.permissionOverwrites;
                    let index = permissions.array.findIndex(perm => perm.id == m.guild.id);
                    if (index == -1) {
                        console.log('error, could not find global perm');
                    } else {
                        permissions[index] = {
                            id: m.guild.id,
                            allow: ['SEND_MESSAGES']
                        };
                        m.channel.overwritePermissions(permissions);
                    }
                }

                //what's the need for this
                m.channel.setPermissions([
                    {
                        id: m.guild.id,
                        deny: ['SEND_MESSAGES']
                    }
                ])
                roles.splice(endPhaseIndex,1);
                players.splice(endPhaseIndex,1);
            }

        });
    }
}