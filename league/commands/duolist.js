module.exports = {
	name: 'duolist',
    description: 'Toggles your looking for duo..',
    aliases: ['dl'],
	execute(message, args, Discord, client) {
        const profiles = require('./../profiles.json');
        const fs = require("fs");
        const index = profiles.findIndex(u => u.discord_id == message.member.id);
        let str = ``;
        for (i = 0; i < profiles.length; i++) {
            if (i == index) continue;
            if (profiles[i].lfd == true) {
                
                try {
                    let mem = message.guild.members.cache.find(member => member.id == profiles[i].discord_id)
                    if (mem == undefined) {
                        console.log(`User invalid, username ${profiles[i].league_username}, deleting profile`);
                        profiles.splice(i, 1);
                        return;
                    }
                    str += `User ${mem} - Lanes: ${profiles[i].lanes}\n`;
                } catch (error) {
                    console.log(error);
                    console.log(`User invalid, username ${profiles[i].league_username}, deleting profile`);
                    profiles.splice(i, 1);
                }
                

                
            }
            if (i == profiles.length-1) {
                message.channel.send({embed: {
                    title:`Looking for Duo List`,
                    description:`${str}\nYou can check any of these accounts with w!profile <accountNumber> <name>`
                }})
            }
        }

        
    }
}