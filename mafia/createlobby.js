const startgame = require("./game_commands/startgame");

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
        const MINIMUM_PLAYERS = 3;
        let ALLOW_ENTRY = true;
        const ANNOUNCE_CHANNEL = message.guild.channels.cache.get("733421818110541932");

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

        function endGame(message2, msg, lobbyMsg, collector) {
            const endGame = require(`./game_commands/endgame.js`);
                try {
                    
                    
                    collector.stop()
                    lobbyMsg = new Discord.MessageEmbed()
                        .setTitle(`Mafia Game - #${gameNumber}`)
                        .setAuthor(`Hosted by ${message.member.displayName}`)
                        .setDescription(`Game has ended.`)
                        .setColor(colors.RED);
                    msg.edit(lobbyMsg);
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    endGame.execute(message2, args, Discord, client);
                    
                } catch (error) {
                    console.log(error);
                    message2.channel.send({embed: {
                        description: `Error found. Report to Whams.`
                    }});
                    return;
                }
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
                .setTitle(`Mafia Game - #${gameNumber}`)
                .setAuthor(`${message.member.displayName}`)
                .setDescription(`React with ✅ to join.`)
                .setColor(colors.RED);

            ANNOUNCE_CHANNEL.send(lobbyMsg).then(msg => {

                //create reaction collector
                msg.react('✅');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅';
                };
                
                const collector = msg.createReactionCollector(filter);
                
                collector.on('collect', (reaction, user) => {
                    if (!user.bot) {
                        guildMember = message.guild.members.cache.find(mem => mem.id == user.id);

                        if (members.length > 9) {
                            guildMember.user.send({embed:{
                                description: `Sorry, you could not join because the lobby was full.`
                            }})
                        }

                        if (ALLOW_ENTRY) {

                            if (members.includes(guildMember)) return;
                            members.push(guildMember);
                            //adds to playerMsg for the guildMember list
                            playerMsg += `\n${members.length}. ${guildMember.displayName}`;

                            //if host, special message
                            if (guildMember.id == host.id) {
                                gameChannel.send({embed: {
                                    color: colors.BLUE,
                                    description: `The host has joined the lobby! Welcome ${guildMember.displayName}! (${members.length} players)`
                                }})
                            } else {
                                gameChannel.send({embed: {
                                    color: colors.BLUE,
                                    description: `${guildMember.displayName} has joined the lobby! (${members.length} players)`
                                }});
                            }
                            
                            //add member to member array
                            

                            //add perms for each member to allow channel view
                            perms.push({
                                id: guildMember.id,
                                allow: ['VIEW_CHANNEL']
                            });

                            //update perms
                            gameChannel.overwritePermissions(perms);

                            //update lobby msg
                            lobbyMsg = new Discord.MessageEmbed()
                                .setTitle(`Mafia Game - #${gameNumber}`)
                                .setAuthor(`Hosted by ${message.member.displayName}`)
                                .setDescription(`React with ✅ to join.`)
                                .addField(`Players (${members.length})`,playerMsg)
                                .setColor(colors.RED);
                            msg.edit(lobbyMsg);
                        } else {
                            gameChannel.send({embed: {
                                color: colors.BLUE,
                                description: `${guildMember.displayName} has joined the lobby as a spectator!`
                            }});
                            //add perms for each member to allow channel view
                            perms.push({
                                id: guildMember.id,
                                allow: ['VIEW_CHANNEL'],
                                deny: ['SEND_MESSAGES']
                            });

                            //update perms
                            gameChannel.overwritePermissions(perms);
                        }
                        

                        
                        
                    }
                        
                });
                client.on('message', async message2 => {
                    if (message2.content.startsWith("m!")) {
                        const args = message2.content.split(/ +/);
                        if (args.length >= 1) {
                            if (args[0] == "m!start") {
                                console.log("Attempting Start");
                                if (members.length < MINIMUM_PLAYERS) {
                                    message2.channel.send({embed: {
                                        description: `Error: not enough players to start the game.`
                                    }});
                                    return;
                                }
    
                                const startGame = require(`./game_commands/startgame.js`);
                                try {
                                    ALLOW_ENTRY = false;
                                    lobbyMsg = new Discord.MessageEmbed()
                                        .setTitle(`Mafia Game - #${gameNumber}`)
                                        .setAuthor(`Hosted by ${message.member.displayName}`)
                                        .setDescription(`Game has already started! React with ✅ to watch.`)
                                        .addField(`Players (${members.length})`,playerMsg)
                                        .setColor(colors.RED);
                                    msg.edit(lobbyMsg);
                                    startGame.execute(message2, args, Discord, client, members);
                                } catch (error) {
                                    console.log(error);
                                    message2.channel.send({embed: {
                                        description: `Error found. Report to Whams.`
                                    }});
                                    return;
                                }
                            } else if (args[0] == "m!end") {
                                endGame(message2, msg, lobbyMsg, collector);
                            } else if (args[0] == "m!leave") {
                                memberIndex = members.findIndex(player => player.id == message2.member.id);
                                members.splice(memberIndex, 1);

                                console.log(members);
                                permIndex = perms.findIndex(perm => perm.id == message2.member.id);
                                perms.splice(permIndex, 1);
                                console.log(permIndex);
                                gameChannel.send({embed: {
                                    color: colors.BLUE,
                                    description: `${message2.member.displayName} has left the lobby. (${members.length} players)`
                                }});
                                gameChannel.overwritePermissions(perms);
                                if (members.length == 0) {
                                    endGame(message2, msg, lobbyMsg, collector);
                                    return;
                                }
                                playerMsg = ``;
                                for (i = 0; i < members.length; i++) {
                                    playerMsg += `\n${members.length}. ${guildMember.displayName}`;
                                }
                                

                                lobbyMsg = new Discord.MessageEmbed()
                                    .setTitle(`Mafia Game - #${gameNumber}`)
                                    .setAuthor(`Hosted by ${message.member.displayName}`)
                                    .setDescription(`React with ✅ to join.`)
                                    .addField(`Players (${members.length})`,playerMsg)
                                    .setColor(colors.RED);
                                msg.edit(lobbyMsg);
                            }
                        } 
                    }
                });
            })

            
        });
    }
}