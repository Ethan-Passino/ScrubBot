const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      //if(message.member.roles.cache.some(role => role.name === "85")) {
    let sayMessage = args.join(" ").slice(0);
    if(!sayMessage) return message.channel.send("Invalid arguments. Correct ussage: >Sbsay <message>");
    message.channel.send(sayMessage);
    //}
    //else return message.reply("You must be level 85 on scrub bot to run this command!");
}

module.exports.help = {
  name: "say"
}