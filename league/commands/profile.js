module.exports = {
	name: 'profile',
	description: 'Checks someone\'s league profile.',
	execute(message, args, Discord, client) {
        let profiles = require("../profiles.json");
        const TeemoJS = require('teemojs');
        const config = require('./../leagueconfig.json');
        let api = TeemoJS(config.token);
        const fs = require("fs");

        let user = undefined;
        let acctNumber = 1;
        
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
            .then((champion_json) => {
                api.get('na1','summoner.getBySummonerName',username).then(data => {
                    api.get('na1','championMastery.getAllChampionMasteries',data.id).then(masteries => {
                        str = ``;
                        let champs = Object.keys(champion_json.data);
                        mastery1 = ``;
                        mastery2 = ``;
                        mastery3 = ``;
                        mastery4 = ``;
                        mastery5 = ``;
                        let values = Object.values(champion_json.data);
                        for (i = 0; i < values.length; i++) {
                            if (values[i].key == masteries[0].championId) {
                                mastery1 = `${values[i].id} - ${masteries[0].championPoints} points, Mastery ${masteries[0].championLevel}\n`;
                            }
                            if (values[i].key == masteries[1].championId) {
                                mastery2 = `${values[i].id} - ${masteries[1].championPoints} points, Mastery ${masteries[1].championLevel}\n`;
                            }
                            if (values[i].key == masteries[2].championId) {
                                mastery3 = `${values[i].id} - ${masteries[2].championPoints} points, Mastery ${masteries[2].championLevel}\n`;
                            }
                            if (values[i].key == masteries[3].championId) {
                                mastery4 = `${values[i].id} - ${masteries[3].championPoints} points, Mastery ${masteries[3].championLevel}\n`;
                            }
                            if (values[i].key == masteries[4].championId) {
                                mastery5 = `${values[i].id} - ${masteries[4].championPoints} points, Mastery ${masteries[4].championLevel}\n`;
                            }
                        }

                        message.channel.send({embed: {
                            title: `Top 5 Masteries`,
                            description: `${mastery1+mastery2+mastery3+mastery4+mastery5}`
                        }});
                    });
                    api.get('na1','match.getMatchlist',data.accountId).then (data2 => {
                        //console.log(data2);
                    });
                })
            });

        
    }
}
