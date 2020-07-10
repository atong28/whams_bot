module.exports = {
	name: 'help',
	description: 'Gives a help message.',
	execute(message, args, Discord, client) {
        embedGame = new Discord.MessageEmbed()
            .setTitle('The WHAM! Game')
            .setDescription(`The WHAM game involves two roles: WHAMER and WHAMED.
            The WHAMER can choose to WHAM! anybody that is not currently WHAMED.
            There is a 40% chance that the WHAMER will successfully WHAM! the target, and a 60% failure rate.
            
            To WHAM! somebody:

            w!wham <person>

            The person can be either tagged in the message or match the person's display name.

            To obtain the WHAMER role:
            There is a 1% chance that you receive a WHAM charge per message you send in chat.
            There is a 5% chance that a message sent will trigger a toss-up event. Reacting to it gives you a WHAM charge.

            Upon success:
            When you succeed in WHAMing someone, the person is now WHAMED, loses all their current WHAM! tokens, and you keep your current WHAM charge.

            Upon failure:
            When you fail to WHAM somebody, you lose your WHAM charge and pass it along to the person you
            attempted to WHAM.

            Resetting the WHAM! game:
            As of current moment, you may run the w!whamreset command to reset the game.
            This command is limited to OG Whams Members and above.

            Listing WHAMED, WHAMERs, or NEITHER:

            w!list [WHAMED/WHAMER/NEITHER]

            Returns a list of people who are either whamed, whamers, or neither.

            Checking someone's status

            `);
        embedGame2 = new Discord.MessageEmbed()
            .setTitle('The WHAM! Game pt. 2')
            .setDescription(`w!check <Person>

            Returns whether a specified person is WHAMED, a WHAMER, or NEITHER. Leaving out the Person argument checks yourself.

            Checking someone's stats

            w!stats <Person>

            Returns the stats of the specified person.

            Checking the leaderboards
            
            w!leaderboard <option>

            Option 1: Successful WHAMs
            Option 2: Failed WHAMs
            Option 3: WHAMs Taken
            Option 4: WHAMs Dodged
            Option 5: Total WHAM! attacking attempts
            Option 6: Total WHAM! receiving attempts
            Option 7: Total WHAM! tokens
            `);
        embedOther = new Discord.MessageEmbed()
            .setTitle('Miscellaneous')
            .setDescription(`Other features of the Whams Bot:
            There is a 0.5% chance that a message not sent by a bot will trigger a custom copypasta text in chat.
            
            BEING FIXED: Telling somebody "you are blocked <tag>" will cause the bot to send a private DM to them telling them that they are indeed blocked.
            
            Rishimute: 10% chance for RC (Retro-Whams) to be censored.`);
        message.channel.send(embedGame).then(msg => {msg.delete({timeout: 60000})}).catch();
        message.channel.send(embedGame2).then(msg => {msg.delete({timeout: 60000})}).catch();
        message.channel.send(embedOther).then(msg => {msg.delete({timeout: 60000})}).catch();
        message.react("✅");
    } 
}
