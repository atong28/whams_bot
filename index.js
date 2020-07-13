const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFilesWhams = fs.readdirSync('./wham_game/commands').filter(file => file.endsWith('.js'));

/**
 * Whams Bot Game Commands
 */
for (const file of commandFilesWhams) {
	const command = require(`./wham_game/commands/${file}`);
	client.commands.set(command.name, command);
}

/**
 * Background Bot Actions
 */
client.backgrounds = new Discord.Collection();
const backgroundsFilesWhams = fs.readdirSync('./wham_game/backgrounds').filter(file => file.endsWith('.js'));

for (const file of backgroundsFilesWhams) {
	const command = require(`./wham_game/backgrounds/${file}`);
	client.backgrounds.set(command.name, command);
}

/**
 * League Commands
 */
const commandFilesLeague = fs.readdirSync('./league/commands').filter(file => file.endsWith('.js'));

for (const file of commandFilesLeague) {
	const command = require(`./league/commands/${file}`);
	client.commands.set(command.name, command);
}

/**
 * Currency Commands
 */
const commandsMoney = fs.readdirSync('./currency').filter(file => file.endsWith('.js'));

for (const file of commandsMoney) {
	const command = require(`./currency/${file}`);
	client.commands.set(command.name, command);
}


client.once('ready', async () => {
	console.log(`${client.user.username} is Ready!`);
	client.user.setActivity(`cries of ${prefix}help`, {type: "LISTENING"});
});

client.on('message', async message => {
  
  const WHAMED = "730251299140009988";
  const WHAMER = "730251287219929170";
  const rishiId = "557379287460741143";

	if (message.author.bot) return; //If mesage was sent by bot, then ignore

	/*Bot Activity not involving Commands*/
	if (Math.random() < 0.005) {
		try {
			const command = client.backgrounds.get("custom_text");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to give you information. Please notify Whams.`
			}}).then(msg => msg.delete({timeout: 10000})).catch();
			console.log(error);
			message.react("⚠️");
			return;
		}
	}
	if (Math.random() < 0.02)
	{
		try {
			const command = client.backgrounds.get("give_charge");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to bless you. Please notify Whams.`
			}}).then(msg => msg.delete({timeout: 10000})).catch();
			console.log(error);
			message.react("⚠️");
			return;
		}
	}
	else if (Math.random() < 0.03)
	{
		try {
			const command = client.backgrounds.get("throw_charge");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to give a token. Please notify Whams.`
			}}).then(msg => msg.delete({timeout: 10000})).catch();
			console.log(error);
			message.react("⚠️");
			return;
		}
	}
	if (message.author.id == rishiId)
	{
		try {
			const command = client.backgrounds.get("rishi_mute");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({embed: {
				color:16711680,
				description: `Oops! Something went wrong while lord Droben attempted to destroy RC's mental. Please notify Whams.`
			}}).then(msg => msg.delete({timeout: 10000})).catch();
			message.react("⚠️");
			return;
		}
	}
	if (message.content.includes("you are blocked"))
	{
		try {
			const command = client.backgrounds.get("blocked");
			command.execute(message, Discord, client);
		} catch (error) {
			message.channel.send({
				embed: {
					color:16711680,
					description: `Oops! Something went wrong while lord Droben attempted to relay the message that you were blocked. Please notify Whams.`
				}
			}).then(msg => msg.delete({timeout: 10000})).catch();
			console.log(error);
			message.react("⚠️");
			return;
		}
		
	}
	
	if (!message.content.startsWith(prefix)) return;

	/*Bot activity involving commands*/

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		message.delete({timeout: 10000}).catch();
		return;
	}

	try {
		message.delete({timeout: 10000}).catch();
		command.execute(message, args, Discord, client);
		
		
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!').then(msg => msg.delete({timeout: 10000}).catch());
	}
	// other commands...
});

client.login(token);
