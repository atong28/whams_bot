module.exports = {
	name: 'test',
	description: 'Checks someone\'s league profile.',
	execute(message, args, Discord, client) { 
        let profiles = require("../profiles.json");
        const TeemoJS = require('teemojs');
        const config = require('./../leagueconfig.json');
        let api = TeemoJS(config.token);
        const fs = require("fs");
        api.get('na1','summoner.getBySummonerName','Drâvęń').then (data => {
            api.get('na1','league.getLeagueEntriesForSummoner',data.id).then(data2 => {
                console.log(data2);
            })
        });
    } 
}