const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    //let errorembed;
    //let perk45Role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(role => role.name === "45"));
    //if(!perk45Role) return message.reply("An error has occured.");
    //if(message.member.roles.cache.has(perk45Role.id))
    //{
    let usersc = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    message.channel.send(`${usersc} you're a scrub.`);
    //}
    //else message.reply("You are not able to use this command. You must be level 45 on scrub bot!");  
}

module.exports.help = {
  name: "scrub"
}