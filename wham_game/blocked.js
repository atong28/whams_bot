module.exports = {
	name: 'blocked',
	description: 'Blocked.',
	execute(message, Discord, client) {
		let user = message.mentions.users.first();
		if (message.mentions.users.first() != undefined)
		{
			user.send(`you are blocked and ${message.member.displayName} doesn't actually know if you ping them and they don't see ur msg unless they want to, so just dont talk tot hem thanks`);
			
		}
    }
}
