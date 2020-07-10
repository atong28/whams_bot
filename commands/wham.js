module.exports = {
	name: 'wham',
	description: 'Attempt to WHAM somebody.',
	execute(message, args, Discord, client) {

        /**
         * Initializes general data variables
         */
		const { ct, ct2 } = require('./../customtext.json')
		const customtext = Math.floor(Math.random()*ct.length);
	    const customtext2 = Math.floor(Math.random()*ct2.length);

        const WHAMED = "730251299140009988";
        const WHAMER = "730251287219929170";

        const data = require("./../counter.json");
        const fs = require("fs"); 

        /**
         * Combine args (no spaces)
         */
        let whamed = undefined;

            let argStr = "";
            for (i = 0; i < args.length; i++) {
                argStr += args[i];
            }
            console.log(argStr);


        /**
         * Find member mentioned
         */
        if (message.mentions.members.size < 1)
        {
            whamed = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

            try {
                whamed.roles
            }
            catch (error) {
                message.react("❓");
                return;
            }
        }
        else
        {
            whamed = message.mentions.members.first();
        }
        
        
        if (message.member.roles.cache.find(r => r.id == WHAMER))
        {
            if (whamed.user.bot)
            {
                message.channel.send({embed: {
                    color:16711680,
                    description: `You cannot wham a bot!`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
                message.react("🚫");
                return;
            }
            if (whamed.id == message.member.id) {
                message.channel.send({embed: {
                    color:16711680,
                    description: `You cannot wham yourself!`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
                message.react("🚫");
                return;
            }
            if (whamed.roles.cache.find(r => r.id == WHAMED))
            {
                message.channel.send({embed: {
                    color: 16711680,
                    description: `They've already been WHAMED! Find someone else to cyberbully.`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
                message.react("🚫");
                return;
            }
           /* else if (whamed.roles.cache.find(r => r.id == WHAMER))
            {
                message.channel.send({embed: {
                    color:16711680,
                    description: `This person currently has Dretfan's protection. Find someone else to cyberbully.`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
                message.react("🚫");
                return;
            }*/

            console.log(data);

            let whammerIndex = undefined;
            let whammedIndex = undefined;

            for (i = 0; i < data.length; i++) {
                if (data[i].id == message.member.id) {
                    whammerIndex = i;
                } else if (data[i].id == whamed.id) {
                    whammedIndex = i;
                }
            }

            console.log("WhammerIndex: "+whammerIndex);
            console.log("WhammedIndex: "+whammedIndex);

            if (whammerIndex == undefined || whammerIndex == null) {
                let newWhammer = {
                    id:message.member.id,
                    successful_whams:0,
                    failed_whams:0,
                    dodged_whams:0,
                    hit_whams:0,
                    wham_tokens:0
                }
                console.log("Early: "+newWhammer.id === message.member.id);
                data.push(newWhammer);
            }

            if (whammedIndex == undefined || whammerIndex == null) {
                let newWhammed = {
                    id:whamed.id,
                    successful_whams:0,
                    failed_whams:0,
                    dodged_whams:0,
                    hit_whams:0,
                    wham_tokens:0
                }
                data.push(newWhammed);
            }

            for (i = 0; i < data.length; i++) {
                console.log("Array: "+data[i].id);
                console.log("Discord: "+message.member.id)
                console.log("Check if equal: "+data[i].id === message.member.id)
                if (data[i].id == message.member.id) {
                    whammerIndex = i;
                } else if (data[i].id == whamed.id) {
                    whammedIndex = i;
                }
            }

            console.log(data);

            if (Math.random() > 0.40)
            {
                message.channel.send({embed: {
                    color: 6160243,
                    description: `${whamed} avoided getting a WHAM from ${message.member}.`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));

                data[whammerIndex].failed_whams += 1;
                data[whammedIndex].dodged_whams += 1;
                data[whammerIndex].wham_tokens -= 1;
                data[whammedIndex].wham_tokens += 1;
                if (data[whammerIndex].wham_tokens == 0)
                {
                    message.member.roles.remove(WHAMER);
                }
                whamed.roles.add(WHAMER);
            }
            else
            {
                message.channel.send({embed: {
                    color: 4474111,
                    description: `${whamed}, you got WHAMED by ${message.member} - ${ct2[customtext2]}`
                }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));

                data[whammerIndex].successful_whams += 1;
                data[whammedIndex].hit_whams += 1;
                data[whammedIndex].wham_tokens = 0;
                whamed.roles.remove(WHAMER);
                whamed.roles.add(WHAMED);
            }

            fs.writeFile("counter.json", JSON.stringify(data), err => { 
     
                // Checking for errors 
                if (err) throw err;  
               
                console.log("Done writing"); // Success 
            }); 


            message.react("✅");
        }
        else
        {
            message.channel.send({embed: {
                color: 16711680,
                description: `Dortven hasn't blessed you with the power to WHAM someone yet. Try again later.`
            }}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
            message.react("🚫");
        }


    }
}
