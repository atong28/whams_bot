module.exports = {
	name: 'createprofile',
    description: 'Creates your league profile.',
    aliases: ['p'],
	execute(message, args, Discord, client) {
        let profiles = require("../profiles.json");
        const TeemoJS = require('teemojs');
        const config = require('../leagueconfig.json');
        let api = TeemoJS(config.token);
        const fs = require("fs");

        let userCheck = undefined;

        let league_user = undefined;
        
        let alts = [];

        let profile = {
            discord_id: message.member.id,
            league_username: league_user,
            league_alts: alts
        }

        console.log(profiles);

        userCheck = profiles.findIndex(userCheck => userCheck.discord_id == message.member.id);
        
        if (userCheck == undefined) {
            message.channel.send({embed: {
                description:`${message.member.displayName}, please reply in chat with your main account's username.`
            }}).then(msg => {
                const filter = m => m.member.id == message.member.id;
                const collector = message.channel.createMessageCollector(filter, { time: 60000 });

                collector.on('collect', m => {
                    collector.stop();
                    message.channel.send({embed: {
                        description: `You replied with ${m.content}. Searching for this username:`
                    }}).then(searchingMsg => {
                        //msg.delete({timeout: 0});
                        //m.delete({timeout: 0});
                        api.get('na1','summoner.getBySummonerName',m.content).then (data => {
                            //searchingMsg.delete({timeout: 0});
                            if (data == null) {
                                message.channel.send({embed: {
                                    description: `I could not find your account, ${message.member.displayName}! Please make sure the spelling is correct.`
                                }})
                                return;
                            }
                            profile.league_username = m.content;
                            message.channel.send({embed: {
                                description: `I found your account, ${message.member.displayName}!
                                Do you have any alt accounts?
                                - A: Yes, I would like to link my alts.
                                - B: No, I'm done with my profile.`
                            }}).then(linkedMsg => {
                                linkedMsg.react('🅰️');
                                linkedMsg.react('🅱');

                                const filter2 = (reaction, user) => {
                                    return (reaction.emoji.name === '🅰️' || reaction.emoji.name === '🅱') && user.id === message.author.id;
                                };
                                
                                const collector2 = linkedMsg.createReactionCollector(filter2, { time: 60000 });
                                
                                collector2.on('collect', (reaction, user) => {
                                    if (!user.bot) {
                                        if (reaction.emoji.name === '🅰️') {
                                            collector2.stop();
                                            //linkedMsg.delete({timeout: 0});
                                            message.channel.send({embed: {
                                                description: `Please respond with all of your alts, separated by a |
                                                Example: Alt1 | Alt2 | Alt3`
                                            }}).then(altMsg => {
                                                const filter3 = m => m.member.id == message.member.id;
                                                const collector3 = message.channel.createMessageCollector(filter3, { time: 60000 });
                                                
                                                collector3.on('collect', m2 => {
                                                    const mAlts = m2.content.split("|");
                                                    for (i = 0; i < mAlts.length; i++) {
                                                        api.get('na1','summoner.getBySummonerName',mAlts[i]).then (data2 => {
                                                            if (data2 == null) {
                                                                message.channel.send({embed: {
                                                                    description: `I could not find your account named ${mAlts[i]}, ${message.member.displayName}! Please make sure the spelling is correct.`
                                                                }})
                                                                collector3.stop();
                                                                return;
                                                            } else {
                                                                profile.league_alts.push(data2.name);
                                                            }
                                                        });
                                                    }
                                                    setTimeout(function() {
                                                        collector3.stop();
                                                        //m2.delete({timeout:0});
                                                        //altMsg.delete({timeout:0});
                                                        message.channel.send({embed: {
                                                            description: `Congratulations, ${message.member.displayName}! Your profile has been linked.
                                                            The alts you sent are: ${alts}`
                                                        }})
                                                        
                                                        profiles.push(profile);
                                                        console.log(profiles);
                                                        fs.writeFile("league/profiles.json", JSON.stringify(profiles), err => { 
                                                            // Checking for errors 
                                                            if (err) throw err;  
                                                        }); 
                                                        
                                                    }, 1000);
                                                })

                                                collector.on('end', collected => {
                                                    if (collected.size == 0) {
                                                        //msg.delete({timeout: 0});
                                                        message.channel.send({embed: {
                                                            description:`You did not respond with anything, ${message.member.displayName}! No profile has been linked.`
                                                        }})
                                                        return;
                                                    }
                                                });
                                            });
                                            
                                        } else {
                                            collector2.stop();
                                            //linkedMsg.delete({timeout: 0});
                                            message.channel.send({embed: {
                                                description: `Congratulations, ${message.member.displayName}! Your profile has been linked.`
                                            }})
                                            let profile = {
                                                discord_id: message.member.id,
                                                league_username: league_user,
                                                league_alts: []
                                            }
                                            profiles.push(profile);
                                            fs.writeFile("league/profiles.json", JSON.stringify(profiles), err => { 
                                                // Checking for errors 
                                                if (err) throw err;  
                                            }); 
                                            
                                        }
                                    }
                                });
                                
                                collector2.on('end', collected => {
                                    if (collected.size == 0) {
                                        //linkedMsg.delete({timeout: 0});
                                        message.channel.send({embed: {
                                            description:`You did not respond with anything, ${message.member.displayName}! No profile has been linked.`
                                        }})
                                        return;
                                    }
                                });
                            })
                        });
                    });
                    
                });

                collector.on('end', collected => {
                    if (collected.size == 0) {
                        //msg.delete({timeout: 0});
                        message.channel.send({embed: {
                            description:`You did not respond with anything, ${message.member.displayName}! No profile has been linked.`
                        }})
                        return;
                    }
                });
            })
        } else {
            message.channel.send({embed: {
                description:`${message.member.displayName}, you already have a profile linked!
                If you would like to add alt accounts, react with A.
                To exit, react with B, or wait for 60 seconds.`
            }}).then(linkedMsg => {
                linkedMsg.react('🅰️');
                linkedMsg.react('🅱');

                const filter2 = (reaction, user) => {
                    return (reaction.emoji.name === '🅰️' || reaction.emoji.name === '🅱') && user.id === message.author.id;
                };
                
                const collector2 = linkedMsg.createReactionCollector(filter2, { time: 60000 });
                
                collector2.on('collect', (reaction, user) => {
                    if (!user.bot) {
                        if (reaction.emoji.name === '🅰️') {
                            collector2.stop();
                            //linkedMsg.delete({timeout: 0});
                            message.channel.send({embed: {
                                description: `Please respond with all of your non-registered alts, separated by a |
                                Example: Alt1 | Alt2 | Alt3
                                Your current alts: ${profiles[userCheck].league_alts}`
                            }}).then(altMsg => {
                                const filter3 = m => m.member.id == message.member.id;
                                const collector3 = message.channel.createMessageCollector(filter3, { time: 60000 });
                                
                                collector3.on('collect', m2 => {
                                    const mAlts = m2.content.split("|");
                                    for (i = 0; i < mAlts.length; i++) {
                                        api.get('na1','summoner.getBySummonerName',mAlts[i]).then (data2 => {
                                            if (data2 == null) {
                                                message.channel.send({embed: {
                                                    description: `I could not find your account named ${mAlts[i]}, ${message.member.displayName}! Please make sure the spelling is correct.`
                                                }})
                                                collector3.stop();
                                                return;
                                            } else {
                                                profiles[userCheck].league_alts.push(data2.name);
                                            }
                                        });
                                    }
                                    setTimeout(function() {
                                        collector3.stop();
                                        //m2.delete({timeout:0});
                                        //altMsg.delete({timeout:0});
                                        message.channel.send({embed: {
                                            description: `Congratulations, ${message.member.displayName}! Your profile has been updated.
                                            Your alt list is now: ${profiles[userCheck].league_alts}`
                                        }})
                                        console.log(profiles);
                                        fs.writeFile("league/profiles.json", JSON.stringify(profiles), err => { 
                                            // Checking for errors 
                                            if (err) throw err;  
                                        }); 
                                        
                                    }, 1000);
                                })

                                collector.on('end', collected => {
                                    if (collected.size == 0) {
                                        //msg.delete({timeout: 0});
                                        message.channel.send({embed: {
                                            description:`You did not respond with anything, ${message.member.displayName}! No profile has been updated.`
                                        }})
                                        return;
                                    }
                                });
                            });
                            
                        } else {
                            collector2.stop();
                            //linkedMsg.delete({timeout: 0});
                            message.channel.send({embed: {
                                description: `You have exited profile creation.`
                            }})
                        }
                    }
                });
                
                collector2.on('end', collected => {
                    if (collected.size == 0) {
                        //linkedMsg.delete({timeout: 0});
                        message.channel.send({embed: {
                            description:`You did not respond with anything, ${message.member.displayName}! No profile has been updated.`
                        }})
                        return;
                    }
                });
            })
        }
        
    }
}