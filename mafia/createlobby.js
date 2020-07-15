module.exports = {
	name: 'createlobby',
    description: 'Creates a mafia lobby.',
    aliases: ['cml','createmafialobby'],
	execute(message, args, Discord, client) {

        /**
         * Imports
         * Data: list of game heads + channel ids, keeps track of game count
         */
        const data = require("./game.json");
        const colors = require("../colors.json");
        const fs = require("fs");
        const gameNumber = data.gameCount;
        const host = message.member;

        /**
         * Create channel function
         * SetParent => set mafia category
         * overwritepermissions: make channel private to all
         */
        function createChannel() {
            return message.guild.channels.create(`mafia-${gameNumber}`, "text").then(chnl => {
                chnl.setParent("732742979701309532");
                chnl.overwritePermissions([
                    {
                        id: message.guild.id,
                        deny: ['VIEW_CHANNEL']
                    }
                ])
                return chnl;
                
            }).catch(console.error);
        }


        createChannel().then(gameChannel => {
            //increment game count
            data.gameCount += 1;

            //set game info with game head, game id, and channel
            data.gameData.push({
                game_id:gameNumber,
                gameHead:host.id,
                channel:gameChannel.id
            });
            
            //update info
            fs.writeFile("mafia/game.json", JSON.stringify(data), err => { 
                // Checking for errors 
                if (err) throw err;  
            }); 

            //Initialize Variables
            //count = num of players in game
            //members = member list, used for implementation later in the actual game
            //perms => sets up permission json for the channel, default starts with @everyone not allowed to view
            let count = 0;
            let members = [];
            perms = [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ];
            let playerMsg = ``;
            
            /**
             * Lobby entering message
             */
            let lobbyMsg = new Discord.MessageEmbed()
                .setTitle(`Mafia Game`)
                .setAuthor(`${message.member.displayName}`)
                .setDescription(`React with ✅ to join.`)
                .setColor(colors.RED);

            message.channel.send(lobbyMsg).then(msg => {

                //create reaction collector
                msg.react('✅');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅';
                };
                
                const collector = msg.createReactionCollector(filter);
                
                collector.on('collect', (reaction, user) => {
                    if (!user.bot) {
                        guildMember = message.guild.members.cache.find(mem => mem.id == user.id);
                        
                        count++;

                        //adds to playerMsg for the guildMember list
                        playerMsg += `\n${count}. ${guildMember.displayName}`;

                        //if host, special message
                        if (guildMember.id == host.id) {
                            gameChannel.send({embed: {
                                color: colors.BLUE,
                                description: `The host has joined the lobby! Welcome ${guildMember.displayName}! (${count} players)`
                            }})
                        } else {
                            gameChannel.send({embed: {
                                color: colors.BLUE,
                                description: `${guildMember.displayName} has joined the lobby! (${count} players)`
                            }});
                        }
                        
                        //add member to member array
                        members.push(guildMember);

                        //add perms for each member to allow channel view
                        perms.push({
                            id: guildMember.id,
                            allow: ['VIEW_CHANNEL']
                        });

                        //update perms
                        gameChannel.overwritePermissions(perms);

                        //update lobby msg
                        lobbyMsg = new Discord.MessageEmbed()
                            .setTitle(`Mafia Game`)
                            .setAuthor(`${message.member.displayName}`)
                            .setDescription(`React with ✅ to join.`)
                            .addField(`Players (${count})`,playerMsg)
                            .setColor(colors.RED);
                        msg.edit(lobbyMsg);
                        
                    }
                        
                });
                
            })
            
        });
       
        
        
        
    }
}