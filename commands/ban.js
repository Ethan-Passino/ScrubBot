const Discord = require("discord.js");
let dir = process.cwd();
dir = dir.substring(0, "commands/");
const g = require("../index.js")


module.exports.run = async (bot, message, args) => {
  let guild = message.guild;
    let gd = message.guild.name;
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission BAN_MEMBERS");
        let user2 = message.guild.member(message.mentions.users.first());

    if(!user2) return message.reply("Please give us someone to ban. >ban <user> [reason]");
    let userid = user2.id;
    let name = guild.members.cache.get(guild.members.cache.findKey(m => m.id === userid)).displayName;
    
    if(user2.hasPermission("BAN_MEMBERS")) return message.reply("This user cannot be banned as they have the BAN_MEMBERS permission.");
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = g.getTime();
    if(creator == user2) return message.reply("You cannot ban yourself!");
    let pfp = user2.user.avatarURL();
    let tg = user2.user.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was banned!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been banned from " + gd + " for" + reason)
        .then(() => {
        gm.ban(reason);
    message.react("✅");
      });
    });    
}

module.exports.help = {
  name: "ban"
}