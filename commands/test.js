const { MessageActionRow, MessageButton } = require("discord.js");
const db = require("../db");

module.exports = {
  description: "Testing",
  category: "Fun",
  ownerOnly: true,
  callback: (message) => {
    db.set('bruharr', ['a', 'b', 'c'])
    db.delete('bruharr'['b'])
  }
}