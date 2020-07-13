module.exports = {
	name: 'ping',
	description: 'Returns client ping.',
	execute(message, args, Discord, client) {
        const then = Date.now();
        message.channel.send('Pinging...').then(message => {
            message.edit(`:ping_pong: Pong! It took ${Date.now() - then}ms to send that message`);
        }).then(msg => msg.delete({timeout: 10000})).catch();
    } 
}
        