const Discord = require("discord.js");
const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
  let user = message.member;
    if(!user.hasPermission("MANAGE_ROLES")) return message.reply("No permission! Think this is an error? Make sure you have the permission MANAGE_ROLES");
    let name = args[0];
    let color = args[1];
    let guild = message.guild;
    let role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(r => r.name === name));
    if(role) return message.reply("A role color already has this name, please use another name!");
    try {
      role = message.guild.roles.create({ data: {
        name: name,
        color: color,
        permissions:[]
      }});
      g.addColor(name);
      message.react("✅");
    }
    catch(e) {
      console.log(e.stack);
    }
}

module.exports.help = {
  name: "createcolor"
}