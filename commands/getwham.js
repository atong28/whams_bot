module.exports = {
	name: 'getwham',
	description: 'Obtain a wham charge.',
	execute(message, args, Discord, client) {
	  const WHAMED = "730251299140009988";
	  const WHAMER = "730251287219929170";
	  const data = require("./../counter.json");
	  const fs = require("fs"); 
    if (message.author.id == "321108985346261002" || message.author.id == "214796172315983872")
    {
		let whammerIndex = undefined;
        for (i = 0; i < data.length; i++) {
			console.log("Array: "+data[i].id);
			console.log("Discord: "+message.member.id)
			console.log("Check if equal: "+data[i].id == message.member.id)
			if (data[i].id == message.member.id) {
				whammerIndex = i;
			}
		}
		if (whammerIndex == undefined)
		{
			let newWhammed = {
				id:whamed.id,
				successful_whams:0,
				failed_whams:0,
				dodged_whams:0,
				hit_whams:0,
				wham_tokens:0
			}
			data.push(newWhammed);
			for (i = 0; i < data.length; i++) {
				console.log("Array: "+data[i].id);
				console.log("Discord: "+message.member.id)
				console.log("Check if equal: "+data[i].id == message.member.id)
				if (data[i].id == message.member.id) {
					whammerIndex = i;
				}
			}
		}
		console.log(whammerIndex);
		console.log(data[whammerIndex]);
		data[whammerIndex].wham_tokens += 1;
		console.log(data[whammerIndex]);
		message.react("✅"); // passing through here
		fs.writeFile("./../counter.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		   
			console.log("Done writing"); // Success 
		});
    }
		else {
			message.react("🚫");
		}
  }
}
