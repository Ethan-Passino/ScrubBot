const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      message.reply("DISABLED !");
      return;
      message.channel.send("TurtleSquad Links\nWebsite: https://turtlesquad.tk \nBan Appeals: https://turtlesquad.tk/StaffApps/ \nBan Appeals: https://turtlesquad.tk/BanAppeals/ \n Rules: https://turtlesquad.tk/Rules/");
}

module.exports.help = {
  name: "links"
}