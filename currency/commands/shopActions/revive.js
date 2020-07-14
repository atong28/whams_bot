module.exports = {
	name: 'revive',
	description: 'Revive player.',
	execute(message, args, Discord, client) {
        const colors = require("../../../colors.json");
		const data = require("../../json/accounts.json"); 
		const prices = require("../../json/itemshop.json");
        const fs = require("fs");
        const WHAMED = "730251299140009988";
        const WHAMER = "730251287219929170";
        
        data[args].id

        const mem = message.guild.members.cache.get(data[args].id);

        if (mem.roles.cache.has(WHAMED)) {
            mem.roles.remove(WHAMED);
            return;
        } else {
            throw `You are already alive! Command cancelled. Your balance has been refunded.`;
        }

	}
}
