module.exports = {
	name: 'throw_charge',
	description: 'Throws a charge up. First to catch it (via reacting) gets a wham charge. >> CURRENTLY HAS SAME FUNCTION AS GIVE_CHARGE <<',
	execute(message, Discord, client) {
        const WHAMED = "730251299140009988";
        const WHAMER = "730251287219929170";
        const {ct, ct2, ct3} = require('./customtext.json')
        const draven_spelling = ct3[Math.floor(Math.random()*ct3.length)];
        const data = require("./counter.json");
        const fs = require("fs");
        
        message.channel.send({embed: {
            title: "WHAM GIVEAWAY",
            description: "React with the gift emoji in 3 seconds to claim a WHAM charge!"
        }}).then(msg => {
            msg.react("🎁"); 
            const filter = (reaction, user) => {
                return reaction.emoji.name === '🎁';
            };
            
            const collector = msg.createReactionCollector(filter, { time: 20000 });
            
            collector.on('collect', (reaction, user) => {
                if (!user.bot) {
                    if (reaction.emoji.name == '🎁') {
                        let whammerIndex = undefined;
                        for (i = 0; i < data.length; i++) { 
                            
                            if (data[i].id == user.id) 
                            {
                                whammerIndex = i;
                                break;
                            }
                        }
                        if (whammerIndex == undefined)
                        {
                            let newWhammed = {
                                id:message.member.id,
                                successful_whams:0,
                                failed_whams:0,
                                dodged_whams:0,
                                hit_whams:0,
                                wham_tokens:1
                            }
                            data.push(newWhammed);
                        }
                        else
                        {
                            data[whammerIndex].wham_tokens += 1;
                        }
                        let guildMember = message.guild.members.cache.find(mem => mem.id == user.id);
                        if (guildMember.roles.cache.has(WHAMED)) return;
                        guildMember.roles.add(WHAMER);
    
                        message.channel.send({embed: {
                        description: `You opened ${draven_spelling}'s gift, ${guildMember.displayName}! !wham another user to use his gift.`
                        }}).then(msg => {collector.stop();}).catch();

                        fs.writeFile("./counter.json", JSON.stringify(data), err => { 
                            // Checking for errors 
                            if (err) throw err;  
                        });
                    }
                }
            });
            msg.delete({timeout: 2000});
        });
        
    }
}
