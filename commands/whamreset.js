module.exports = {
	name: 'whamreset',
	description: 'Reset the wham game.',
	execute(message, args, Discord, client) {
		const WHAMED = "730251299140009988";
    const WHAMER = "730251287219929170";
    
    if (!message.member.roles.cache.find(staff => staff.id === "709077301391785984" || staff.id === "720426637874954251" || staff.id === "707093942918709260")) {
        message.react("🚫");
        return;
    }


    message.guild.roles.cache.find(r => r.id === WHAMED).members.forEach(mem => {
        mem.roles.remove(WHAMED);
    })
    message.guild.roles.cache.find(r => r.id === WHAMER).members.forEach(mem => {
        mem.roles.remove(WHAMER);
    })
    message.react("✅");
  }
}
