module.exports = {
	name: 'throw_charge',
	description: 'Throws a charge up. First to catch it (via reacting) gets a wham charge. >> CURRENTLY HAS SAME FUNCTION AS GIVE_CHARGE <<',
	execute(message, Discord, client) {
        const WHAMED = "730251299140009988";
        const WHAMER = "730251287219929170";
        const {ct, ct2, ct3} = require('./customtext.json')
        const draven_spelling = ct3[Math.floor(Math.random()*ct3.length)];
        const data = require("./counter.json");
        
        message.channel.send({embed: {
            title: "WHAM GIVEAWAY",
            description: "React with the gift emoji in 2 seconds to claim a WHAM charge!"
        }}).then(msg => {msg.react("🎁"); msg.delete({timeout: 20000}); // setting longer for now for testing

            const collector = message.createReactionCollector((reaction) => reaction.emoji.name = '🎁', {time: 10000});

            collector.on('collect', (reaction, user) => {
                if (user.bot) return;
                if (reaction.emoji.name == '🎁') {
                    let whammerIndex = 0;
                    for (i = 0; i < data.length; i++) { 
                        console.log("Array: "+data[i].id);
                        console.log("Discord: "+user.id)
                        console.log("Check if equal: "+data[i].id === user.id)
                        
                        if (data[i].id == user.id) 
                        {
                            whammerIndex = i;
                            break;
                        }
                    }
                    data[whammerIndex].wham_tokens += 1;

                    let guildMember = message.guild.members.cache.find(mem => mem.id === user.id);
                    if (guildMember.roles.cache.has(WHAMED)) return;
                    guildMember.roles.add(WHAMER);

                    message.channel.send({embed: {
                    description: `You opened ${draven_spelling}'s gift, ${guildMember.displayName}! !wham another user to use his gift.`
                    }}).then(msg => {collector.stop();}).catch( console.log("hehe"));
                }
            })
        });
    }
}
