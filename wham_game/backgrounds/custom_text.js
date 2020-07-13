module.exports = {
	name: 'custom_text',
	description: 'Sends custom text.',
	execute(message, Discord, client) {
        const { ct, ct2, ct3 } = require('../json/customtext.json')
        const customtext = Math.floor(Math.random()*ct.length);
        if (message.channel.id == "720699455648563210" || message.channel.id == "715687169494089778") { return; }
		message.channel.send(ct[customtext]);
    }
}
