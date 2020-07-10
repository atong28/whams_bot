module.exports = {
	name: 'getwham',
	description: 'Obtain a wham charge.',
	execute(message, args, Discord, client) {
	  const WHAMED = "730251299140009988";
	  const WHAMER = "730251287219929170";
    if (message.author.id == "321108985346261002" || message.author.id == "214796172315983872")
    {
        message.member.roles.add(WHAMER);
        message.react("✅");
    }
		else {
			message.react("🚫");
		}
  }
}
