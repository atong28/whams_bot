const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { ct, ct2, ct3 } = require('./customtext.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.backgrounds = new Discord.Collection();
const backgroundsFiles = fs.readdirSync('.').filter(file => file.endsWith('.js'));

for (const file of backgroundsFiles) {
	const command = require(`./${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.backgrounds.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  
  const WHAMED = "730251299140009988";
  const WHAMER = "730251287219929170";

	if (message.author.bot) return;

	if (Math.random() < 0.005) {
		try {
			const command = client.backgrounds.get("custom_text");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to give you information. Please notify Whams.`
			}})
			console.log(error);
			message.react("🚫");
			return;
		}
	}
	if (Math.random() < 0.05)
	{
		try {
			const command = client.backgrounds.get("give_charge");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to bless you. Please notify Whams.`
			}})
			console.log(error);
			message.react("🚫");
			return;
		}
	}
	if (message.author.id == "557379287460741143")
	{
		try {
			const command = client.backgrounds.get("rishi_mute");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to destroy RC's mental. Please notify Whams.`
			}})
			message.react("🚫");
			return;
		}
	}
	if (message.content.includes("you are blocked"))
	{
		try {
			const command = client.backgrounds.get("blocked");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to relay the message that you were blocked. Please notify Whams.`
			}})
			message.react("🚫");
			return;
		}
		
	}
	if (!message.content.startsWith(prefix)) return;



	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();


	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	try {
		command.execute(message, args, Discord, client);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
	// other commands...
});
client.login(token);
