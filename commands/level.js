const Discord = require("discord.js");
const g = require("../index.js");

module.exports.run = async (bot, message, args) => {
  let lUser = message.mentions.users.first();
    let res = false;
    if(!lUser)
    {
      res = true;
      lUser = message.member;
    }
    let pfp;
    let u;
    if(!res)
    {
      pfp = lUser.avatarURL();
      u = lUser.tag;
    }
    else
    {
      pfp = lUser.user.avatarURL();

      u = lUser.user.tag;
    }
    let SbRank;
    let NextRank;
    let rankType;
       //func.setPoints(id, data);
     //func.getPoints(id);
     //func.getLevel(id);
  //func.hasData(id)
    const key = "[" + message.author.id + "] {" + message.guild.id + "}";
  if(!(g.hasData(key))) return message.reply("You have no level somehow... I don't know how you did that lol.");
  let lvl = g.getLevel(key);
  let pts = g.getPoints(key);
    if(lvl >= 1 && lvl < 45) rankType = "Basic Scrub";
    if(lvl >= 45 && lvl < 85) rankType = "Presitged";
    if(lvl >= 85 && lvl < 250) rankType = "The Unknown";
    if(lvl >=250 && lvl <= 500) rankType = "Non-Scrubs";
    if(lvl >= 1 && lvl < 5) {
      SbRank = "Scrublett";
      NextRank = "Scrub";
    }
    if(lvl >= 5 && lvl < 10){
      SbRank = "Scrub";
      NextRank = "Scrub Elite";
    }
    if(lvl >= 10 && lvl < 20){
      SbRank = "Scrub Elite";
      NextRank = "Scrub Lord";
    }
    if(lvl >= 20 && lvl < 35){
      SbRank = "Scrub Lord";
      NextRank = "Scrub God";
    }
    if(lvl >= 35 && lvl < 45){
      SbRank = "Scrub God";
      NextRank = "Prestige Scrublett";
    }
    if(lvl >= 45 && lvl < 50){
      SbRank = "Prestige Scrublett";
      NextRank = "Prestige Scrub";
    }
    if(lvl >= 50 && lvl < 55){
      SbRank = "Prestige Scrub";
      NextRank = "Prestige Scrub Elite";
    }
    if(lvl >= 55 && lvl < 65){
      SbRank = "Prestige Scrub Elite";
      NextRank = "Prestige Scrub Lord";
    }
    if(lvl >= 65 && lvl < 75){
      SbRank = "Prestige Scrub Lord";
      NextRank = "Prestige Scrub God";
    }
    if(lvl >= 75 && lvl < 85){
      SbRank = "Prestige Scrub God";
      NextRank = "Omega Scrub";
    }
    if(lvl >= 85 && lvl < 100){
      SbRank = "Omega Scrub";
      NextRank = "???";
    }
    if(lvl >= 100 && lvl < 250){
      SbRank = "Scrub Overlord";
      NextRank = "???";
    }
    if(lvl >= 250 && lvl < 500){
      SbRank = "Scrubless";
      NextRank = "???";
    }
    if(message.author.bot) SbRank = "Bot";
    let nextlvl = Math.floor(((lvl+1)/0.85)*((lvl+1)/0.85));
    let untilnextlvl = nextlvl-pts
    if(lvl === 500){
      SbRank = "Ultimate Turtle";
      NextRank = "Max Level and Rank";
      nextlvl = "N/A";
      untilnextlvl = "N/A";
    }
    var levelembed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("Level Info")
      .setAuthor(u, pfp, "")
      .addField(`They are level: `, `${lvl}`)
      .addField(`They have: `, `${pts} points`)
      .addField(`Their Current Rank: `, `${SbRank}`)
      if(nextlvl != "N/A") levelembed.addField(`Their Next level: `, `${pts}/${nextlvl}`)
      else levelembed.addField("Their next level:", "N/A")
      .addField("Points Until Next Level:", `${untilnextlvl}`)
      .addField("Next Rank:", `${NextRank}`)
      .addField("Rank Type:", `${rankType}`)
    message.channel.send(levelembed);
}

module.exports.help = {
  name: "level"
}