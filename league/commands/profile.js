const { ReactionUserManager } = require("discord.js");

module.exports = {
	name: 'profile',
    description: 'Checks someone\'s league profile.',
    aliases: ['p'],
	execute(message, args, Discord, client) {
        let profiles = require("../profiles.json");
        const prefix = require("../../config.json");
        const TeemoJS = require('teemojs');
        const config = require('./../leagueconfig.json');
        let api = TeemoJS(config.token);
        const fs = require("fs");

        let user = undefined;
        let acctNumber = 1;
        if (args.length === 0) {
            user = message.member;
        } else if (args.length >= 1) {

            if (isNaN(args[0])) {
                message.channel.send({
                    embed: {
                        description: `That's an improper usage of ${prefix}profile!\nUsage: w!profile <account number> <person>\nAccount 1 is your main, and account 2 and onwards are your alts.` 
                    }
                });
                return;
            }
            user = message.member;
            acctNumber = args[0];
            
            if (args.length > 1) {
                
                let argStr = "";
                for (let i = 1; i < args.length; i++) {
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
            }
        }

        let playerIndex = undefined;
        playerIndex = profiles.findIndex(profile => profile.discord_id == user.id);

        if (playerIndex == -1) {
            message.channel.send({embed: {
                description: `${user} is not registered in my system!\nPlease tell them to create a profile by doing w!createprofile.`
            }})
        } else {
            let playerData = profiles[playerIndex];
            let username = "";
            if (acctNumber == 1) {
                username = playerData.league_username;
            } else {
                if (playerData.league_alts.length <= acctNumber - 2) {
                    message.channel.send({embed:{
                        description: `The account number you entered was too high.`
                    }});
                    return;
                }
                username = playerData.league_alts[acctNumber-2];
            }

            if (username == undefined) {
                message.channel.send({
                    embed: {
                        description: `Uh oh. Something went wrong. Make sure your account is as you expect.`
                    }
                });
            }

            const fetch = require('node-fetch');

            let url = "http://ddragon.leagueoflegends.com/cdn/10.14.1/data/en_US/champion.json";

            let settings = { method: "Get" };

            

            let mastery1 = ``;
            let mastery2 = ``;
            let mastery3 = ``;
            let rankedSolo = ``;
            let rankedFlex = ``;
            let summonerLevel = ``;
            let image = undefined;
            let lastPlayed = `Last played: `;
            let lanes = ``;

            fetch(url, settings)
                .then(res => res.json())
                .then((champion_json) => {
                    api.get('na1','summoner.getBySummonerName',username).then(data => {

                        //Fetch profile icon
                        fetch(`http://ddragon.leagueoflegends.com/cdn/10.14.1/data/en_US/profileicon.json`, settings)
                        .then(res => res.json())
                        .then((icons_json) => {
                            image = `http://ddragon.leagueoflegends.com/cdn/10.14.1/img/profileicon/${data.profileIconId}.png`;
                        });

                        summonerLevel = data.summonerLevel;
                        api.get('na1','championMastery.getAllChampionMasteries',data.id).then(masteries => {
                            let champs = Object.keys(champion_json.data);
                            for (i = 0; i < champs.length; i++) {
                                ;
                                if (champion_json.data[champs[i]].key == masteries[0].championId) {
                                    mastery1 = `${champion_json.data[champs[i]].id} - ${masteries[0].championPoints} pts | M${masteries[0].championLevel}\n`;
                                }
                                if (champion_json.data[champs[i]].key == masteries[1].championId) {
                                    mastery2 = `${champion_json.data[champs[i]].id} - ${masteries[1].championPoints} pts | M${masteries[1].championLevel}\n`;
                                }
                                if (champion_json.data[champs[i]].key == masteries[2].championId) {
                                    mastery3 = `${champion_json.data[champs[i]].id} - ${masteries[2].championPoints} pts | M${masteries[2].championLevel}\n`;
                                }
                            }
                        });
                        api.get('na1','league.getLeagueEntriesForSummoner',data.id).then(data2 => {

                            switch (data2.length) {
                                case 2:
                                    if (data2[0].queueType == 'RANKED_SOLO_5x5') {
                                        rankedSolo = `${data2[0].tier} ${data2[0].rank}\n${data2[0].wins}W/${data2[0].losses}L\n${Math.round((data2[0].wins * 100) / (data2[0].wins + data2[0].losses))}% WR`;
                                        rankedFlex = `${data2[1].tier} ${data2[1].rank}\n${data2[1].wins}W/${data2[1].losses}L\n${Math.round((data2[1].wins * 100) / (data2[1].wins + data2[1].losses))}% WR`;
                                    } else {
                                        rankedFlex = `${data2[0].tier} ${data2[0].rank}\n${data2[0].wins}W/${data2[0].losses}L\n${Math.round((data2[0].wins * 100) / (data2[0].wins + data2[0].losses))}% WR`;
                                        rankedSolo = `${data2[1].tier} ${data2[1].rank}\n${data2[1].wins}W/${data2[1].losses}L\n${Math.round((data2[1].wins * 100) / (data2[1].wins + data2[1].losses))}% WR`;
                                    }
                                    
                                    break;
                                case 1:
                                    if (data2[0].queueType == 'RANKED_SOLO_5x5') {
                                        rankedSolo = `${data2[0].tier} ${data2[0].rank}\n${data2[0].wins}W/${data2[0].losses}L\n${Math.round((data2[0].wins * 100) / (data2[0].wins + data2[0].losses))}% WR`;
                                        rankedFlex = `N/A`;
                                    } else {
                                        rankedSolo = `N/A`;
                                        rankedFlex = `${data2[1].tier} ${data2[1].rank}\n${data2[1].wins}W/${data2[1].losses}L\n${(data2[1].wins * 100) / (data2[1].wins + data2[1].losses)}% WR`;
                                    }
                                    break;
                                case 0:
                                    rankedSolo = `N/A`;
                                    rankedFlex = `N/A`;
                                    break;
                            }

                            
                        });
                        api.get('na1','match.getMatchlist',data.accountId).then (data2 => {
                            var time = new Date(data2.matches[0].timestamp);
                            lastPlayed += time.toString();

                        });
                    })
                });
            if (playerData.lanes.length == 0) {
                lanes = `Not set yet.`
            } else {
                lanes = playerData.lanes.toString();
            }

            if (mastery1 + mastery2 + mastery3 == ``) {
                mastery1 = `Could not load masteries.`
            }
            if (rankedSolo == ``) {
                rankedSolo = `Could not load Ranked Solo/Duo Stats.`
            }
            if (rankedFlex == ``) {
                rankedFlex = `Could not load Ranked Flex Stats.`
            }
            setTimeout(() => {
                const regex = / /gi;
                let profile = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setAuthor(`${message.member.displayName}`)
                    .setTitle(`${user.displayName}'s Stats (OP.GG Link)`)
                    .setURL(`http://na.op.gg/summoner/userName=${username.replace(regex,"%20")}`)
                    .setDescription(`Account - ${username} | Level ${summonerLevel}`)
                    .addField(`Masteries`, `${mastery1+mastery2+mastery3}`, true)
                    .addField(`Ranked Solo/Duo`,rankedSolo, true)
                    .addField(`Ranked Flex`, rankedFlex, true)
                    .addField(`Lane Roles`, lanes)
                    .setFooter(lastPlayed)
                    .setThumbnail(image);
                message.channel.send(profile);
                
            }, 1500);
        }
        
        
    }
}
