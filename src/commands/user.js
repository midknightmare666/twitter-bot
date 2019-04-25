const Discord = require('discord.js');
const cheerio = require('cheerio');
const request = require('request');
const chalk = require('chalk');

module.exports.run = async (twitter, message, args) => {
	let userSearch = args[0];

		if(!userSearch) {
			return message.channel.send('please provide a valid Twitter username')
		} else {
			request(`https://twitter.com/${userSearch}`, async (err, response, html) => {
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

					const bio = $('.ProfileHeaderCard-bio.u-dir').text()
					let bioData = await bio

					const website = $('.ProfileHeaderCard-urlText.u-dir').text()
					let websiteLink = await website

					const tweets = $('[data-nav="tweets"] .ProfileNav-value')
					let tweetsData = await tweets.data('count')

					const favorites = $('[data-nav="favorites"] .ProfileNav-value').text()
					let likes = await favorites

					const following = $('[data-nav="following"] .ProfileNav-value')
					let followingData = await following.data('count')

					const followers = $('[data-nav="followers"] .ProfileNav-value')
					let followersData = await followers.data('count')

					let handle = `https://twitter.com/${userSearch}`

					let titleImage = 'https://seeklogo.com/images/T/twitter-2012-negative-logo-5C6C1F1521-seeklogo.com.png'

					let twitterEmbed = new Discord.RichEmbed()
						.setColor('#00000')
						.setAuthor(userSearch, titleImage, handle)
						.setTitle(`Follow ${userSearch}`)
						.setURL(`https://twitter.com/${userSearch}`)
						.setDescription(bioData)
						.setThumbnail(avatarData)
						.setImage(headerData)
						.addField('Following:', `${followingData}`, true)
						.addField('Followers:', `${followersData}`, true)
						.addField('Tweets:', `${tweetsData}`, true)
						.addField('Likes:', `${likes}`, true)
						if(website !== undefined || 'undefined') {
							twitterEmbed.setFooter(websiteLink)
						}
					await message.channel.send('searching....').then((msg) => {
						msg.edit(twitterEmbed)
					})
					// console.log(response.statusCode)
			};
		});
	};
};

module.exports.config = {
	name: 'twitter',
	aliases: ['tuser', 'twitteruser']
}
