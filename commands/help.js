const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    function send(text) {
    message.channel.send(text);
  }
  let embed;
   let a = args[0];
    if(!a)
    {
      embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Help")
      .setDescription("This is all the sections.")
      .addField(">help leveling", "displays all of the leveling commands.")
      .addField(">help info", "displays all of the info commands.")
      .addField(">help moderation", "displays all of the moderation commands.")
      .addField(">help colors", "displays all of the color commands.")
      .addField(">help fun", "displays all of the fun commands.");
      
    
      send(embed);
    }
    else if(a === "leveling") {
      embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Leveling Help")
      .setDescription("This is all of the leveling commands.")
      .addField(">level", "Tells you your level and how many points you have.")
      .addField(">ranks", "Displays information about ranks.")
      .addField(">top", "Shows the people with the highest 10 levels on the server.");
      
    
      send(embed);
    }
    else if(a === "info") {
            embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Info Help")
      .setDescription("This is all of the info commands.")
      .addField(">help", "Prints out all of the help sections and what they contain.")
      .addField(">info", "Displays information about the bot.")
      .addField(">links", "Prints all of our links.") 
      .addField(">user <user>", "List information about the given user. If you put no user, the user will default to the message author.");
    
      send(embed);
    }
    else if(a === "moderation") {
      if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Contact an administator.");
            embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Moderation Help")
      .setDescription("This is all of the moderation commands.")
      .addField(">ban @<user> [reason]", "bans the given user for the given reason. Requires the permission BAN_MEMBERS")
      .addField(">tempban @<user> <time (1d = 1 day 1h = 1 hour 1m = 1 minute)> [reason]", "bans the given user for the given reason until the given time is up. Requires the permission BAN_MEMBERS")
      .addField(">mute @<user> [reason]", "gives the user the muted role for the given reason. Requires the permission KICK_MEMBERS")
      .addField(">tempmute @<user> <time (1d = 1 day 1h = 1 hour 1m = 1 minute)> [reason]", "gives the user the muted role for the given reason until the given time it up. Requires the permission KICK_MEMBERS")
      .addField(">unmute @<user> [reason]", "removes the muted role from the given user for the given reason. (Works for both tempmutes and mutes). Requires the permission KICK_MEMBERS")
      .addField(">kick @<user> [reason]", "kicks the given user from the server for the given reason. Requires the permission KICK_MEMBERS")
      .addField(">warn @<user> [reason]", "warns the given user for the given reason. Requires the permission KICK_MEMBERS")
      .addField(">prune <amount of messages>", "Deletes the given amount of messages up. Requires the permission MANAGE_MESSAGES");      
    
      send(embed);
    }
    else if(a === "colors" || a === "colours") {
              embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Color Help")
      .setDescription("This is all of the color commands.")
      .addField(">setcolor <color>", "sets your users color to the color of your choosing. If you already have a color this will remove that color.")
      .addField(">removecolor", "removes any color that you have.")
      .addField(">colors", "lists out all of the colors.")
      .addField(">createcolor <color> <hex code>", "creates a color with the given role name with the given hex code. Requires the permission MANAGE_ROLES");
      
    
      send(embed);
    }
    else if(a === "fun") {
            embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Fun Help")
      .setDescription("This is all of the fun commands.")
      .addField("didyouknow", "prints a random did you know message.")
      .addField(">scrub <user>", "Tells a user that they are a scrub. You must be level 45 on scrub bot to use this command.")
      .addField(">say <what to say>", "Makes the bot say what you want it to say. You must be atleast level 85 on scrub bot to use this command.")
      .addField(">scrubrate <user>", "gives a rating on how much someone is a scrub. You must be at least level 45 on the scrub bot to be able to use this command.");
      
    
      send(embed);
    }
    else {
      message.reply("You gave an invalid argument. Valid arguments: leveling, info, moderation, music, colors, fun");
    }
}

module.exports.help = {
  name: "help"
}