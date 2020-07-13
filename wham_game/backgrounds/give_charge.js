module.exports = {
	name: 'give_charge',
	description: 'Gives a charge to a player.',
	execute(message, Discord, client) {
        const WHAMED = "730251299140009988";
		const WHAMER = "730251287219929170";
		const data = require("../json/counter.json");
		const fs = require("fs");
		const {ct, ct2, ct3} = require('../json/customtext.json')
        const draven_spelling = ct3[Math.floor(Math.random()*ct3.length)];

		if (message.member.roles.cache.has(WHAMED)) {
			message.channel.send({embed: {
				description: `You opened ${draven_spelling}'s gift, ${message.member.displayName}! You have been un-whamed.`
				}}).then(msg => {msg.delete({timeout: 10000})}).catch();
			message.member.roles.remove(WHAMED);
			return;
		}
		
        

		let whammerIndex = undefined;
		for (i = 0; i < data.length; i++) {
			if (data[i].id == message.member.id) {
				whammerIndex = i;
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
				wham_tokens:0
			}
			data.push(newWhammed);
			whammerIndex = data.length-1;
		}
		data[whammerIndex].wham_tokens += 1;
		message.member.roles.add(WHAMER);

		fs.writeFile("wham_game/json/counter.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		  });
		
		message.channel.send({embed: {
			description: `${draven_spelling} has blessed you, ${message.member.displayName}! !wham another user to use his blessing.`
		}}).then(msg => {msg.delete({timeout: 10000})}).catch();
    }
}
