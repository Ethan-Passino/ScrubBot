const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let client = bot;
    // Limited to guild owner - adjust to your own preference!
    if(message.author.id !== message.guild.ownerID) 
      return message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) return message.reply("You must mention someone or give their ID!");
    const pointsToRemove = parseInt(args[1], 10);
    if(!pointsToRemove) 
      return message.reply("You didn't tell me how many coins to remove..")
    // Ensure there is a points entry for this user.
    client.points.ensure(`${message.guild.id}-${user.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    // Get their current points.
    let userCoins = client.coins.get(`${message.guild.id}-${user.id}`, "coins");
    userCoins -= pointsToRemove;
    
    // And we save it!
    client.coins.set(`${message.guild.id}-${user.id}`, userCoins, "coins")
    message.channel.send(`${user.tag} has lost ${pointsToRemove} coins and now stands at ${userCoins} coins.`);
}

module.exports.help = {
  name: "removecoins"
}