const Discord = require("discord.js");
const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
      let client = bot;
    // Limited to guild owner - adjust to your own preference!
    if(message.author.id !== message.guild.ownerID) 
      return message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if(!user) return message.reply("You must mention someone or give their ID!");
    const pointsToAdd = parseInt(args[1], 10);
    if(!pointsToAdd) 
      return message.reply("You didn't tell me how many points to give...")
    // Ensure there is a points entry for this user.
    client.points.ensure(`${message.guild.id}-${user.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    // Get their current points.
    //let userPoints = client.points.get(`${message.guild.id}-${user.id}`, "points");
    const key = "[" + message.author.id + "] {" + message.guild.id + "}";
    let userPoints = g.getPoints(key) + pointsToAdd;
    
    // And we save it!
    //client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points")
    g.setPoints(key, userPoints);
    message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userPoints} points.`);
}

module.exports.help = {
  name: "give"
}