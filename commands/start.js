const { Message, MessageCollector, MessageEmbed, DiscordAPIError, MessageActionRow, MessageButton } = require("discord.js");
const db = require("../db");
module.exports = {
  category: "Fun",
  description: "Starts a game.",
  cooldown: "60s",
  slash: "both",
  guildOnly: true,

  callback: async ({ message, interaction }) => {
    if (message) {
      var gameactive = await db.get(`guild-${message.guild.id}-gameactive`);
      if (gameactive !== undefined) {
        return message.reply("A game is already active, please end the currently active game first using the command: end.")
          .then((msg) => {
            setTimeout(() => {
              msg.delete();
              message.delete();
            }, 2500);
          });
      }
      var startembed = new MessageEmbed()
        .setTitle("Start")
        .setDescription("Let's start a game! First of all, what channel would you like the games to be in?")
        .setColor("GREEN");
      message.channel
        .send({
          embeds: [startembed],
        })
        .then((msg) => {
          setTimeout(() => {
            msg.delete();
            message.delete();
          }, 10000);
        });

      const mfilter = (m) => m.author.id === message.author.id;
      const channelcollector = message.channel.createMessageCollector({
        filter: mfilter,
        max: 1,
        time: 1000 * 60,
      });
      channelcollector.on("collect", (cmessage) => {
        if (cmessage.mentions.channels.first()) {
          cmessage.delete();
          db.set(`guild-${message.guild.id}-gameactive`, true);
          const gamechannel = cmessage.mentions.channels.first();
          var gamecode =
            gamechannel.id.slice(2, 4) +
            Math.floor(Math.random() * 9) +
            Math.floor(Math.random() * 9) +
            message.author.id.slice(6, 8);
          db.set(`guild-${message.guild.id}-game-${gamecode}`, gamecode);
          var joinembed = new MessageEmbed()
            .setTitle("Join!")
            .setColor("GREEN")
            .setFooter(
              `Game started by ${message.author.tag}`,
              message.author.displayAvatarURL()
            )
            .setFields([
              {
                name: `${message.author.tag} is hosting a cow game!`,
                value: "Join the cow game and grab some milk!",
              },
              {
                name: "Game Code",
                value: gamecode,
              },
              {
                name: "How to join",
                value: `To join, use the command join followed by the game code.\nFor Example: !join abc123. You have 2 minutes to join!`,
              },
            ])
            .setImage(
              "https://i.ibb.co/j4CYb0z/Screen-Shot-2021-10-12-at-9-15-33-AM.png"
            );
          gamechannel
            .send({
              embeds: [joinembed],
            })
            .then(async (msg) => {
              setTimeout(async () => {
                var players = await db.get(`guild-${message.guild.id}-players`);
                if (players !== undefined) {
                  startgame(msg);
                  db.set(
                    `guild-${message.guild.id}-gameactive`,
                    msg.channel.id
                  );
                } else {
                  db.delete(`guild-${message.guild.id}-gameactive`);
                  db.delete(`guild-${message.guild.id}-game-${gamecode}`);
                  msg.channel
                    .send("Nobody joined the game so the game was cancelled!")
                    .then((msg1) => {
                      msg1.delete();
                    }, 2500);
                }
              }, 120 * 1000);
            });
        } else {
          return cmessage
            .reply("You didn't reply with a valid channel!")
            .then((msg) => {
              setTimeout(() => {
                msg.delete();
                cmessage.delete();
              }, 2500);
            });
        }
      });
      channelcollector.on("end", (collected) => {
        if (collected.size === 0) {
          message.delete();
          message.reply("You didn't reply in time! (60s)").then((msg) => {
            setTimeout(() => {
              msg.delete();
              message.delete();
            }, 2500);
          });
        }
      });
    }
  },
};

// Function for red light, green light. For message, it is refering to msg in the .then after the gamechannel.send()
function startgame(message) {
  var lightembed = new MessageEmbed()
    .setTitle("Red Light, Green Light")
    .setColor("GOLD")
    .setFields([
      {
        name: "The game is starting!",
        value: "The game is starting, no more people will be allowed to join.",
      },
      {
        name: "Red Light, Green Light",
        value: "The first game will be red light, green light!",
      },
      {
        name: "How it works",
        value:
          "In 5 seconds the game will start, a message will come up below this one. Click the button on the message really fast! You have 30 seconds to click 20 times!"
      },
    ]);
  message.channel.send({
    embeds: [lightembed],
  });
  setTimeout(async () => {
  var rlglbuttonrow = new MessageActionRow()
    .addComponents(
      new MessageButton()
      .setCustomId('clicklight')
      .setLabel('Click Me!')
      .setStyle('SUCCESS')
    )
    message.channel.send({
      content: 'Click this! Totally legit not scam no punjabi (virus) 100%',
      components: [rlglbuttonrow]
    })

    const lightfilter = i => i.customId === 'clicklight'
  
    const lightcollector = message.channel.createMessageComponentCollector({ lightfilter, time: 30 * 1000 });
  
    lightcollector.on('collect', async i => {
      i.deferUpdate()
      var userscore = await db.get(`user-${i.user.id}-rlglscore`)
      if (userscore !== undefined) {
        db.set(`user-${i.user.id}-rlglscore`, userscore + 1)
      } else {
        db.set(`user-${i.user.id}-rlglscore`, 1)
      }
    })
    lightcollector.on('end', async collected => {
      var playerarray = await db.get(`guild-${message.guild.id}-players`)
      playerarray.forEach(async (player) => {
        if (await db.get(`user-${player}-rlglscore`) < 20) {
          db.set(`user-${player}-eliminated`, player)
        }
      })
    })
  }, 5000)
}