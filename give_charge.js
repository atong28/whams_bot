module.exports = {
	name: 'give_charge',
	description: 'Gives a charge to a player.',
	execute(message, Discord, client) {
        const WHAMED = "730251299140009988";
		const WHAMER = "730251287219929170";
		const data = require("./counter.json");
		const fs = require("fs");

		if (message.member.roles.cache.get(WHAMED)) {
			return;
        }
        const {ct, ct2, ct3} = require('./customtext.json')
        const draven_spelling = ct3[Math.floor(Math.random()*ct3.length)];

		let whammerIndex = undefined;
		for (i = 0; i < data.length; i++) {
			console.log("Array: "+data[i].id);
			console.log("Discord: "+message.member.id)
			console.log("Check if equal: "+data[i].id === message.member.id)
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

		fs.writeFile("counter.json", JSON.stringify(data), err => { 
     
			// Checking for errors 
			if (err) throw err;  
		   
			console.log("Done writing"); // Success 
		  });
		
		message.channel.send({embed: {
			description: `${draven_spelling} has blessed you, ${message.member.displayName}! !wham another user to use his blessing.`
		}}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
    }
}
