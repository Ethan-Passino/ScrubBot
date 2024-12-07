const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  let ranksembed = new Discord.MessageEmbed()
    .setColor("#FFFF00")
    .setTitle("Leveling information.")
    .setDescription("This shows the different ranks you can get and the level you need to be to get to a certain rank.")
    .addField("Scrublett", "Level 1-4. 0 Points")
    .addField("Scrub", "Level 5-9. 25 Points")
    .addField("Scrub Elite", "Level 10-19. 138 Points")
    .addField("Scrub Lord", "Level 20-34. 553 Points")
    .addField("Scrub God", "Level 35-44. 1,695 Points")
    .addField("Prestige Scrublett", "Level 45-49. 2,802 Points. Once you reach this level, you will now have access to the >Sbscrub <user> command!")
    .addField("Prestige Scrub", "Level 50-54. 3,460 Points")
    .addField("Prestige Elite Scrub", "Level 55-64. 4,186 Points")
    .addField("Prestige Scrub Lord", "Level 65-74. 5,847 Points")
    .addField("Prestige Scrub God", "Level 75-84. 7,785 Points")
    .addField("Omega Scrub", "Level 85-99. 10,000 Points")
    .addField("???", "Level 100-???. 13,840 Points")
    .addField("???", "Level ???-???. ?????? Points")
    .addField("???", "Level ???-???. ??????? Points");
    message.channel.send(ranksembed);
}

module.exports.help = {
  name: "ranks"
}