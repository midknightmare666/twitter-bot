const fs = require('fs');
const chalk = require('chalk');
const Discord = require('discord.js');
const botconfig = require('../src/botconfig.json');

const twitter = new Discord.Client({disableEveryone: true});

twitter.commands = new Discord.Collection();

fs.readdir('../src/commands/', (err, files) => {
	if(err) console.error(err);
		let jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if(jsfiles.length <= 0) {
		console.log(chalk.red('No Commands To Load Idiot!'));
		return;
};

	jsfiles.forEach((f, i) => {
		let pull = require(`./commands/${f}`);
		console.log(chalk.green(`${i + 1}: ${f} loaded!`))
		twitter.commands.set(pull.config.name, pull);
	});
})

twitter.on('ready', (async) => {
	console.log(chalk.cyan(`${twitter.user.tag} is online`));
});

twitter.on('message', async message => {
	if(message.author.bot) return;
	if (message.channel.bot) return;

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(' ');
	let cmd = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);

	if(!message.content.startsWith(prefix)) return;
	let commandfile = twitter.commands.get(cmd.slice(prefix.length)) || twitter.commands.get(twitter.aliases.get(cmd.slice(prefix.length)));
	if(commandfile) commandfile.run(twitter,message,args);
});

twitter.login(botconfig.token);

