module.exports = {
	name: 'shop',
	description: 'View the shop.',
	execute(message, args, Discord, client) {
        const colors = require("../../colors.json");
        message.channel.send({embed: {
            color: colors.PURPLE,
            description: `**Shop**:
            
            **Revive:** 10<:silvercoin:732299457428848732>
            Removes your WHAMED status. Consumed on purchase.`
        }})

	}
}
