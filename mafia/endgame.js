module.exports = {
	name: 'endgame',
    description: 'Ends the game.',
    aliases: ['eg','end'],
	execute(message, args, Discord, client) {
        const gameData = require("./game.json");
        if (message.channel.parentID != "732742979701309532") {
            message.channel.send({embed: {
                description: "You are not in a mafia game! Navigate to your mafia game channel and retry with this command."
            }});
            return;
        }

        const gameNum = parseInt(message.channel.name.substring(6));
        console.log(gameNum);
        if (message.member.id != gameData.gameData[gameNum-1].gameHead) {
            message.channel.send({embed: {
                description: "You are not the game head! If you believe you are, make sure you are in the right mafia channel."
            }});
            return;
        }

        const channel = message.guild.channels.cache.get(gameData.gameData[gameNum-1].channel);
        channel.delete();
        gameData.gameData[gameNum] = {};
        fs.writeFile("mafia/game.json", JSON.stringify(data), err => { 
            // Checking for errors 
            if (err) throw err;  
        }); 
    }
}