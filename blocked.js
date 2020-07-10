module.exports = {
	name: 'blocked',
	description: 'Blocked.',
	execute(message, Discord, client) {
		if (message.mentions.members.array.length > 0)
		{
			message.mentions.members.first().user.send(`you are blocked and ${message.member.displayName} doesn't actually know if you ping them and they don't see ur msg unless they want to, so just dont talk tot hem thanks`);
		}
    }
}
