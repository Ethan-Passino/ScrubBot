const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let uUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if(!uUser) uUser = message.member;
    let pfp = uUser.user.avatarURL();
    let u = uUser.user.tag;
    var profile = new Discord.MessageEmbed()
    .setTitle("Profile")
    .setAuthor(u, pfp)
    .setDescription("User Information")
    .setColor(0x00AE86)
    .addField("Bannable:", `${uUser.bannable}`)
    .addField("Kickable:", `${uUser.kickable}`)
    .addField("Manageable:", `${uUser.manageable}`)
    .addField("Role Color:", `${uUser.colorRole}`)
    .addField("Nickname [if none username]:", `${uUser.displayName}`)
    .addField("Highest Role:", `${uUser.highestRole}`)
    .addField("Join time:", `${uUser.joinedAt}`)
    .addField("Join Timestamp:", `${uUser.joinedTimestamp}`)
    .addField("Last Message:", `${uUser.lastMessage}`);
    message.channel.send(profile).catch(console.error);
}

module.exports.help = {
  name: "user"
}