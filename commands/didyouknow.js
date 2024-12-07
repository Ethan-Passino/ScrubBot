const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  message.reply("DISABLED !");
  return;
  function didYouKnow() {
    var rand = ["Did you know, the owner of the discord server made this bot?", "Did you know, this bot has over 1300 lines of code?", "Did you know, you can ask for a color to be added by putting the hex of the color you want, and the name of the color, and tagging Tc and telling him to add it?", "Did you know, there is a huge logs part of this bot?", "Did you know this discord server is almost a year old? It was made on 9/28/17.", "Did you know, Turtles are hot?", "Did you know, you can partner with this server? (If you are interested, contact Tc/TurtlesAreHot.)", "Did you know, you are a scrub?", "Did you know, the idea of ScrubBot came from Adamy calling everyone scrubs for being inactive?"];

    return rand[Math.floor(Math.random()*rand.length)];
}

  let dyk = didYouKnow();
    if(!dyk) return message.reply("Something went wrong. Please contact @Tc");
    message.reply(dyk);
}

module.exports.help = {
  name: "didyouknow"
}