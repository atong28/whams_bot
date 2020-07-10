module.exports = {
	name: 'whamreset',
	description: 'Reset the wham game.',
	execute(message, args, Discord, client) {
		const WHAMED = "730251299140009988";
    const WHAMER = "730251287219929170";
    const data = require("./../counter.json");
    const fs = require("fs"); 
    if (!message.member.roles.cache.find(staff => staff.id === "709077301391785984" || staff.id === "720426637874954251" || staff.id === "707093942918709260")) {
        message.react("🚫");
        return;
    }


    message.guild.roles.cache.find(r => r.id === WHAMED).members.forEach(mem => {
        mem.roles.remove(WHAMED);
    })
    message.guild.roles.cache.find(r => r.id === WHAMER).members.forEach(mem => {
        mem.roles.remove(WHAMER);
    })

    for (i = 0; i < data.length; i++)
    {
      data[i].wham_tokens = 0;
    }
    fs.writeFile("counter.json", JSON.stringify(data), err => { 
     
      // Checking for errors 
      if (err) throw err;  
     
      console.log("Done writing"); // Success 
    });
    message.react("✅");
  }
}
