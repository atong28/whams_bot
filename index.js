const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { ct, ct2 } = require('./customtext.json')

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  const customtext = Math.floor(Math.random()*ct.length);
  const customtext2 = Math.floor(Math.random()*ct2.length);
  const WHAMED = "730251299140009988";
  const WHAMER = "730251287219929170";

	if (message.author.bot) return;

	if (Math.random() < 0.005) {
		if (message.channel.id == "720699455648563210" || message.channel.id == "715687169494089778") { return; }
		message.channel.send(ct[customtext]);
	}
	if (Math.random() < 0.05)
	{
		if (message.member.roles.cache.get(WHAMER)) {
			return;
		}

		if (message.member.roles.cache.get(WHAMED)) {
			return;
		}
		message.member.roles.add(WHAMER);
		message.channel.send({embed: {
			description: `Dortven has blessed thee! !wham another user to use his blessing.`
		}});
	}
	if (message.author.id == "557379287460741143")
	{
		if (Math.random() < 0.10)
		{
			message.delete();
			message.author.send('WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS WHAMS <@557379287460741143>');
		}
	}
	if (message.content.includes("you are blocked"))
	{
		console.log("you are blocked, "+message.mentions.members.first())
		if (message.mentions.members.array.length > 0)
		{
			message.mentions.members.first().user.send(`you are blocked and ${message.member.user.username} doesn't actually know if you ping them and they don't see ur msg unless they want to, so just dont talk tot hem thanks`);
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
