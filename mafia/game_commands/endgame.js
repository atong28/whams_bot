module.exports = {
	name: 'endgame',
    description: 'Ends the game.',
    aliases: ['eg','end'],
	execute(message, args, Discord, client) {
        const gameData = require("../game.json");
        const fs = require("fs");
        if (message.channel.parentID != "732742979701309532") {
            message.channel.send({embed: {
                description: "You are not in a mafia game! Navigate to your mafia game channel and retry with this command."
            }});
            return;
        }

        const gameNum = parseInt(message.channel.name.substring(6));
        console.log(gameNum);
        if (message.member.id != gameData.gameData.find(game => game.game_id == gameNum).gameHead) {
            message.channel.send({embed: {
                description: "You are not the game head! If you believe you are, make sure you are in the right mafia channel."
            }});
            return;
        }

        const channel = message.channel;
        channel.delete();
        gameData.gameData[gameNum] = {};
        fs.writeFile("mafia/game.json", JSON.stringify(gameData), err => { 
            // Checking for errors 
            if (err) throw err;  
        }); 
    }
}