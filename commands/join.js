const { MessageEmbed } = require("discord.js");
const db = require("../db");

module.exports = {
	category: "Fun",
	description: "Join a game that is active.",
	cooldown: "5s",
	slash: "both",
	guildOnly: true,

	callback: async ({ message, interaction, args }) => {
		if (message) {
			if (!args[0]) {
				return message.reply(`You need to input a game code to join a game. e.g: join abc123`)
					.then((msg) => {
						setTimeout(() => {
							msg.delete();
							message.delete();
						}, 2500);
					});
			}
			var rawcode = args[0].toString();
			var rawcodenumber = parseInt(rawcode);
			if (isNaN(rawcodenumber)) {
				return message.reply(`That's not a valid game code!`).then((msg) => {
					setTimeout(() => {
						msg.delete();
						message.delete();
					}, 2500);
				});
			} else {
				if (
					(await db.get(`guild-${message.guild.id}-gameactive`)) === typeof ''
				) {
					return message.reply("Sorry, this game has already started!")
						.then((msg) => {
							setTimeout(() => {
								msg.delete();
								message.delete();
							}, 2500);
						});
				}
				var ongame = await db.get(`guild-${message.guild.id}-game-${rawcode}`);
				if (ongame === undefined) {
					return message.reply(`That's not a valid game code!`).then((msg) => {
						setTimeout(() => {
							msg.delete();
							message.delete();
						}, 2500);
					});
				} else {
					var joinedembed = new MessageEmbed()
						.setTitle("New player has joined!")
						.setColor("GREEN")
						.setFields([
							{
								name: "A new player joined the cow game!",
								value: `${message.author.tag} has joined the cow game!`,
							},
						]);
					message.channel.send({
							embeds: [joinedembed],
						})
						.then((msg) => {
							setTimeout(() => {
								msg.delete();
								message.delete();
							}, 2500);
						});
					if (
						(await db.get(`guild-${message.guild.id}-players`)) === undefined
					) {
						db.set(`guild-${message.guild.id}-players`, [
							`${message.author.id}`,
						]);
					} else {
						db.push(`guild-${message.guild.id}-players`, message.author.id);
					}
				}
			}
		}
	},
};

// Finished, i think?