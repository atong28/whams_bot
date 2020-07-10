module.exports = {
	name: 'give_charge',
	description: 'Gives a charge to a player.',
	execute(message, Discord, client) {
        const WHAMED = "730251299140009988";
        const WHAMER = "730251287219929170";
        if (message.member.roles.cache.get(WHAMER)) {
			return;
		}

		if (message.member.roles.cache.get(WHAMED)) {
			return;
        }
        const {ct, ct2, ct3} = require('./customtext.json')
        const draven_spelling = ct3[Math.floor(Math.random()*ct3.length)];

		message.member.roles.add(WHAMER);
		message.channel.send({embed: {
			description: `${draven_spelling} has blessed you, ${message.member.displayName}! !wham another user to use his blessing.`
		}}).then(msg => {msg.delete({timeout: 10000})}).catch( console.log("hehe"));
    }
}
