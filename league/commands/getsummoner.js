module.exports = {
	name: 'getsummoner',
	description: 'Creates your league profile.',
	execute(message, args, Discord, client) {
        const TeemoJS = require('teemojs');
        const config = require('./../leagueconfig.json');
        const profiles = require('./../profiles.json');
        let api = TeemoJS(config.token);

        /**
         * Parse Args
         * w!getsummoner (default: self, main)
         * w!getsummoner <tag/display name> (default: main)
         * w!getsummoner <tag/display name> <account #>
         */

        let user = undefined;
        let acctNumber = 0;
        
        if (args.length === 0) {
            user = message.member;
        } else if (args.length >= 1) {
            /**
             * Combine args (no spaces)
             */

            let argStr = "";
            for (i = 0; i < args.length; i++) {
                argStr += args[i];
            }


            /**
             * Find member mentioned
             */
            if (message.mentions.members.size < 1)
            {
                user = message.guild.members.cache.find(m => (argStr.toLowerCase() == m.displayName.toLowerCase().replace(/\s+/g, '')));

                try {
                    user.roles
                }
                catch (error) {
                    message.react("❓");
                    return;
                }
            }
            else
            {
                user = message.mentions.members.first();
            }
            if (args.length > 1) {
                acctNumber = args[1];
            }
        }

        let playerIndex = undefined;

        for (i = 0; i < profiles.length; i++) {
            if (profiles[i].discord_id == user.id) {
                playerIndex = i;
                break;
            }
        }

        let playerData = profiles[playerIndex];
        let username = "";
        if (acctNumber === 1) {
            username = playerData.league_username;
        } else {
            username = playerData.league_alts[acctNumber-1];
        }

        const fetch = require('node-fetch');

        let url = "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json";

        let settings = { method: "Get" };

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                console.log(json);
            });


        api.get('na1','summoner.getBySummonerName',username).then(data => {
            api.get('na1','championMastery.getAllChampionMasteries',data.accountID).then(masteries => {
                const str = `1. ${masteries}
                `;
                message.channel.send({embed: {
                    description: `Top 5 masteries: `
                }})
            });
            api.get('na1','match.getMatchlist',data.accountId).then (data2 => {
                console.log(data2);
            });
        })
        
        
        
    }
}