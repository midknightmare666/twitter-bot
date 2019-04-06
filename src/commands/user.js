const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
const chalk = require('chalk');

module.exports.run = async (twitter, message, args) => {
	let userSeach = args[0];

		if(!userSeach) {
			return message.channel.send('please provide a valid Twitter username')
		} else {
			request(`https://twitter.com/${userSeach}`, async (err, response, html) => {
				if(err) {
					return console.log(err)
				} 
				else if(response.statusCode == 404) {

					return message.channel.send('error! invalid username')
				} 
				else if(!err) {

					const $ = cheerio.load(html);

					const header = $('.ProfileCanopy-headerBg img').attr('src')
					let headerData = await header

					const avatar = $('.ProfileAvatar-image').attr('src')
					let avatarData = await avatar

					const tweets = $('[data-nav="tweets"] .ProfileNav-value')
					let tweetsData = tweets.data('count')

					const following = $('[data-nav="following"] .ProfileNav-value')
					let followingData = await following.data('count')

					const followers = $('[data-nav="followers"] .ProfileNav-value')
					let followersData = await followers.data('count')

					let twitterEmbed = new Discord.RichEmbed()
						.setColor('#00000')
						.setTitle(`${userSeach}`)
						.setDescription(`Follow [${userSeach}](https://twitter.com/${userSeach})`)
						.setThumbnail(avatarData)
						.setImage(headerData)
						.addField('Tweets:', `${tweetsData}`, true)
						.addField('Following:', `${followingData}`, true)
						.addField('Followers:', `${followersData}`, true)
						.setTimestamp()
					await message.channel.send(twitterEmbed)
					console.log(response.statusCode)
			}
		});
	};
};

module.exports.config = {
	name: 'user'
}