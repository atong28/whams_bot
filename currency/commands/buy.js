module.exports = {
	name: 'buy',
	description: 'Buy an item from the shop.',
	execute(message, args, Discord, client) {


        const colors = require("../../colors.json");
		const data = require("../json/accounts.json"); 
		const prices = require("../json/itemshop.json");
		const fs = require("fs"); 		

		if (args.length < 1)
		{
			message.channel.send({embed: {
				color: colors.RED,
				description: `Couldn't find that item.`
			}});
			return;
		}
        /**
         * Find user and create new account if not present
         */
		let memberIndex = undefined;
		for (i = 0; i < data.length; i++) {
			if (data[i].id == message.member.id) {
				memberIndex = i;
			}
		}
		if (memberIndex == undefined)
		{
			newAccount = {
				id: message.member.id,
				silver_bal: 0,
				gold_bal: 0,
			}
			data.push(newAccount);
			memberIndex = data.length-1;
		}

		let priceIndex = undefined;
		for (i = 0; i < prices.length; i++) {
			if (prices[i].name.toLowerCase() == args[0].toLowerCase()) {
				priceIndex = i;
			}
		}
		if (priceIndex == undefined)
		{
			message.channel.send({embed: {
				color: colors.RED,
				description: `Couldn't find that item.`
			}});
			return;
		}
		else
		{
			priceS = prices[priceIndex].sPrice;
			priceG = prices[priceIndex].gPrice;
			if (priceS > data[memberIndex].silver_bal)
			{
				message.channel.send({embed: {
					color: colors.RED,
					description: `You don't have enough <:silvercoin:732299457428848732> to buy ${prices[priceIndex].name}.
					You have: ${data[memberIndex].silver_bal}<:silvercoin:732299457428848732>
					Required: ${priceS}<:silvercoin:732299457428848732>`
				}}).then(msg => {msg.delete({timeout: 10000})}).catch();
			}
			else if (priceG > data[memberIndex].gold_bal)
			{
				message.channel.send({embed: {
					color: colors.RED,
					description: `You don't have enough <:goldcoin:732296673019035721> to buy ${prices[priceIndex].name}.
					You have: ${data[memberIndex].silver_bal}<:goldcoin:732296673019035721>
					Required: ${priceS}<:goldcoin:732296673019035721>`
				}}).then(msg => {msg.delete({timeout: 10000})}).catch();
			}
			else
			{
				message.channel.send({embed: {
					color: colors.GREEN,
					description: `You purchased ${prices[priceIndex].name} for: ${priceS}<:silvercoin:732299457428848732>  ${priceG}<:goldcoin:732296673019035721>`
				}}).then(msg => {msg.delete({timeout: 10000})}).catch();
				data[memberIndex].gold_bal -= gPrice;
				data[memberIndex].silver_bal -= sPrice;
			}
		}
        


        /**
         * Saving
         */
	
		fs.writeFile("currency/json/accounts.json", JSON.stringify(data), err => { 
			// Checking for errors 
			if (err) throw err;  
		});

	}
}
