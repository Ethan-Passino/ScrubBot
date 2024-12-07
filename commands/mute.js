const Discord = require("discord.js");

const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
  let gd = message.guild.name;
  let guild = message.guild;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to mute. >tempmute <user> [reason]");
    if(user2.hasPermission("KICK_MEMBERS")) return message.reply("This user cannot be muted as they have the KICK_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.cache.find(memb => memb.id === userid).displayName;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = g.getTime();
    if(creator == user2) return message.reply("You cannot mute yourself!");
    let pfp = user2.user.avatarURL();
    let tg = user2.user.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was muted!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.cache.find(ch => ch.name === "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been muted in " + gd + " for" + reason)
        .then(() => {
        let muted = message.guild.roles.cache.find(rol => rol.name === "Muted");
        gm.roles.add(muted).catch(console.error);
        message.react("✅");
      });
    });  
}

module.exports.help = {
  name: "mute"
}