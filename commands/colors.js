const Discord = require("discord.js");
const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
  message.reply(g.getColors());
}

module.exports.help = {
  name: "colors"
}