const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(role => role.name === "Turtle"));
      message.member.roles.add(role).catch(console.error);
      message.react("✅");
}

module.exports.help = {
  name: "getrole"
}