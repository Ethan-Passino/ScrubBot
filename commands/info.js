const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      message.reply("DISABLED !");
      return;
      message.reply("This is the ScrubBot created by Tc. This bot is only for TurtleSquad and my Testing server. You cannot invite this bot to other servers. If you found this on another server, please report it to us. Thank you. This bot is for leveling on TurtleSquad.");
}

module.exports.help = {
  name: "info"
}