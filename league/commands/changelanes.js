module.exports = {
	name: 'changelanes',
    description: 'Changes your current lanes',
    aliases: ['cl'],
	execute(message, args, Discord, client) {
        const profiles = require('./../profiles.json');
        const fs = require("fs");
        const index = profiles.findIndex(u => u.discord_id == message.member.id);

        
        message.channel.send({embed: {
            description: `Reply with ALL of your lanes, separated by a |`
        }}).then(laneMsg => {
            const filter = m => m.member.id == message.member.id;
            const collector = message.channel.createMessageCollector(filter, { time: 60000 });

            collector.on('collect', m => {
                collector.stop();
                const lanes = m.content.split("|");
                profiles[index].lanes = [];
                for (i = 0; i < lanes.length; i++) {
                    const lane = lanes[i].replace(/ /g,'').toLowerCase();
                    
                    switch (lane) {
                        case "top":
                            profiles[index].lanes.push("top");
                            break;
                        case "jungle":
                            profiles[index].lanes.push("jungle");
                            break;
                        case "mid":
                            profiles[index].lanes.push("mid");
                            break;
                        case "bot":
                            profiles[index].lanes.push("bot");
                            break;
                        case "support":
                            profiles[index].lanes.push("support");
                            break;
                        default:
                            message.channel.send({embed: {
                                description: `A lane you sent was not valid!\nCanceling command.\nOptions: top, jungle, mid, bot, support.`
                            }});
                            return;
                    }
                    
                }
                message.channel.send({embed: {
                    description: `Lane update was successful.`
                }});
                fs.writeFile("league/profiles.json", JSON.stringify(profiles), err => { 
                    // Checking for errors 
                    if (err) throw err;  
                }); 
            });
            collector.on('end', collected => {
                if (collected.size == 0) {
                    
                    message.channel.send({embed: {
                        description:`You did not respond with anything, ${message.member.displayName}! Command cancelled.`
                    }})
                    return;
                }
            });
            
        });

        
    }
}