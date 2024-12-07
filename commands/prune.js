const Discord = require("discord.js");
const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
  let user = message.member;
  let guild = message.guild;
    if(!user.hasPermission("MANAGE_MESSAGES")) return message.reply("No permission! Think this is an error? Make sure you have the permission MANAGE_MESSAGES");
    let channel = message.channel;
    let ammount = args.join(' ');
    if(!ammount) return message.reply("Please specify the amount that you want to delete.");
    if(isNaN(ammount)) return message.reply("The amount paramater is not a number! It needs to be a number.");
    if(ammount > 100) return message.reply("You cannot delete more than 100 messages at once.");
    if(ammount < 1) return message.reply("You can delete 1 message yourself.");
    let allmsges = message.channel.messages.fetch({limit: ammount}).then(messages => {
      message.channel.bulkDelete(messages, true);
    });
    var time = g.getTime();
    let le = new Discord.MessageEmbed()
      .setTitle("pruned some messages.")
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription("Channel:\n```" + message.channel.name + "```\nAt:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.cache.find(ch => ch.name === "logs").send(le).catch(console.error);
}

module.exports.help = {
  name: "prune"
}