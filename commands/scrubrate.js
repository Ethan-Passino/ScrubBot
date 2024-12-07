const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
  let msg = message;
  function scrubRate() {
  var scrubRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  return scrubRates[Math.floor(Math.random()*scrubRates.length)];
}


           // the user can type the command ... your command code goes here :
          //let perk45Role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(role => role.name === "45"));
          //if(!perk45Role) return message.reply("You are not the correct level to be able to do this. You need to 45 role to use this command. If this is an error contact an administrator.");
          //if(message.member.roles.cache.has(perk45Role.id)) {
          let scrubrateuser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
          if(!scrubrateuser) scrubrateuser = message.member;
          let scrubrate = scrubRate();
          let pfp = scrubrateuser.user.avatarURL();
          let u = scrubrateuser.user.tag;
          var scrubrateembed = new Discord.MessageEmbed()
          .setTitle("Scrub Rate")
          .setAuthor(u, pfp)
          .setDescription("This is a randomly generated percentage on what percentage of a scrub they are.\nScrub Rate:\n```" + scrubrate + "%```")
          .setColor(0x00AE86)
          message.channel.send(scrubrateembed);
        //}
        //else return message.reply("You must be atleast level 45 on scrub bot to use this command!");
        // Adds the user to the set so that they can't talk for a minute
        setTimeout(() => {
          // Removes the user from the set after a minute
        }, 60000);
    
}

module.exports.help = {
  name: "scrubrate"
}