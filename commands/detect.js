const Discord = require("discord.js");
const func = require("../index.js");
module.exports.run = async (bot, message) => {
  if(message.author.bot) return;
  function randomEmoji() {
  var randemoji = ["", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","", "", "", "","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","🙃", "😲", "🤔", "🤨", "😮", "😴", "😌", "😜", "😂", "😤", "🐢"];
  return randemoji[Math.floor(Math.random()*randemoji.length)];
}
  
  let randEmoji2 = randomEmoji();
  if(!randEmoji2 == "") message.react(randEmoji2);
    let messagetoString = message.toString();
    const capSymbols = ["~", "`", "1", "!", "2", "@", "3", "#", "4", "$", "5", "%", "6", "^", "7", "&", "8", "*", "9", "(", "0", ")", "-", "_", "=", "+", "[", "{", "]", "}", "|", ";", ":", "'", ",", "<", ".", ">", "/", "?", ":"];

  if(message.toString() == message.toString().toUpperCase() && !capSymbols.some(word => message.content.includes(word)) && message.toString().length >= 4)
  {
    var capsDetectEmbed = new Discord.MessageEmbed()
    .setTitle("[Caps Detect]")
    .setDescription("We have detected someone using full caps and we have warned them.\nSender: ```" + message.member.displayName + "```\nThey said: ```" + message + "```\nAt: ```" + message.createdAt + "```\nIn Channel: " + message.channel)
    .setColor(0x00AE86);
    message.guild.channels.cache.get(message.guild.channels.cache.findKey(cn => cn.name === "logs")).send(capsDetectEmbed).catch(console.error);
  }
  
  const swearWords = ["CUNT", "Cunt", "Kys", "KYS", "KILL YOURSELF", "Kill yourself", "Kill Yourself", "CHING CHONG", "Ching chong", "Ching Chong", "Nazi", "NAZI", "Jewboy", "JEWBOY", "NIGGER", "Nigger", "NIG", "Nig", "Nigor", "NIGOR", "Niger", "NIGER", "Nigra", "NIGRA", "Nigre", "NIGRE", "Nigar", "NIGAR", "Niggur", "NIGGUR", "Nigga", "NIGGA", "Niggah", "NIGGAH", "Niggar", "NIGGAR", "Nigguh", "NIGGUH", "cunt", "kys", "kill yourself", "bluegum ", "ching chong", "nazi ", "jewboy ", "nigger ", "niger ", "nig ", "nigor ", "nigra ", "nigre ", "nigar ", "niggur ", "nigga ", "niggah ", "niggar ", "niggar ", "nigguh ", "niggress ", "nigette ", "redneck ", "sand nigger", "Niggress", "NIGGRESS", "Nigette", "NIGETTE", "Redneck", "REDNECK", "Sand Nigger", "Sand nigger", "SAND NIGGER"];
  if( swearWords.some(word => message.content.includes(word)) ) {
    var autoDetectEmbed = new Discord.MessageEmbed()
    .setTitle("[Auto Detect]")
    .setDescription("We have detected that someone is using a word they should not be.\nSender: ```" + message.member.displayName + "```\nThey said: ```" + message + "```\nAt: ```" + message.createdAt + "```\n In Channel: " + message.channel)
    .setColor(0x00AE86);
    message.guild.channels.cache.get(message.guild.channels.cache.findKey(cn => cn.name === "logs")).send(autoDetectEmbed).catch(console.error);
  }
  if(message.content.includes("i need scrubbot")) {
    let whatneed;
    ///let whatneed = args.join(" ").slice(15).toLowerCase();
    if(!whatneed) return message.reply("Hi! What do you need?");
  }
  
   if (message.guild) {
     //func.setPoints(id, data);
     //func.getPoints(id);
     //func.getLevel(id);
     //if(true) return;
     const key = "[" + message.author.id + "] {" + message.guild.id + "}";
     let pts;
     let lvl;
     //console.log(func.hasData(key))
     if(func.hasData(key)) {
       pts = func.getPoints(key);
       lvl = func.getLevel(key);
     }  else {
       pts = 0;
       lvl = 0;
     }
     pts++;
    // We'll use the k,ey often enough that simplifying it is worth the trouble.
    //const key = `${message.guild.id}-${message.author.id}`;
    // Triggers on new users we haven't seen before.
    //bot.points.ensure(`${message.guild.id}-${message.author.id}`, {
     // user: message.author.id,
      //guild: message.guild.id,
      //points: 0,
      //level: 1
    //});
    //bot.coins.ensure(`${message.guild.id}-${message.author.id}`, {
     // user: message.author.id,
      //guild: message.guild.id,
      //coins: 0
    //});
    //Remove // from  all bellow if you want to reenable scrub coin gain.
    //let chance = Math.floor((Math.random() * 30) + 1);
    //if(chance == 15)
    //{
      //bot.coins.math(key, "+", 5, "coins");
      //message.reply("You have earned 5 scrub coins!");
    //}
    //if(bot.points.get(key, "level") == 500);
    //else bot.points.math(key, "+", 1, "points");
    
    // Calculate the user's current level
    const curLevel = Math.floor(0.85 * Math.sqrt(pts)); //This line will calculate the square root of currentPoints then multiplies that result by 0.8 then floors that result for a round number.
    
   if (lvl < curLevel) { //If this is true, will level up and depending on what level you are leveing up to, you will l
      if(curLevel == 5) {
        message.react("✨");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a scrub! Welcome to the Scrub crew ya scrub. You also now have the Active Turtle role nice :)`);
        let activeTurtle = message.guild.roles.cache.find(role => role.name === "Active Turtle");
        message.member.roles.add(activeTurtle).catch(console.error);
      }
      else if(curLevel == 10) {
        message.react("✨");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Scrub Elite!`);
      }
      else if(curLevel == 20) {
        message.react("✨");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Scrub Lord. But I'm the one, the only, ScrubBot! I'm still better than you ;). You are also now have the Turtle MVT role. Nice!`);
        let turtleMVT = message.guild.roles.cache.find(role => role.name === "Turtle MVT");
        message.member.roles.add(turtleMVT).catch(console.error);
      }
      else if(curLevel == 35) {
        message.react("✨");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Scrub God. You may be a god, but you are still a scrub. Get good.`);
      }
      else if(curLevel == 45) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Prestige Scrublett. Back to being a Scrublett, get good. You also now have access to the >Sbscrub <user> command! Try it out! You also have >Sbscrubrate <user> check that out too!`);
        let perk45Role = message.guild.roles.cache.find(role => role.name === "45");
        message.member.roles.add(perk45Role).catch(console.error);
        let activeTurtleMVT = message.guild.roles.cache.find(role => role.name === "Active Turtle MVT");
        message.member.roles.add(activeTurtleMVT).catch(console.error);
      }
      else if(curLevel == 50) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Prestige Scrub. I still think you are a Scrublett though. Friggen scrub.`);
      }
      else if(curLevel == 55) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Prestige Scrub Elite. May be elite, but I'm a bot. You humans can't be more elite than a bot!`);
      }
      else if(curLevel == 65) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Prestige Scrub Lord. You still aren't cool... Get good you scrub.`);
      }
      else if(curLevel == 75) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Prestige Scrub God. So bad... You can do better. Reach level 85 for your next rank. This rank is more superior. Good luck :)`);
      }
      else if(curLevel == 85) {
        message.react("🎇");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Omega Scrub. You reached level 85! Nice job! Now get to the next level. You have found one of the secret ranks. Reach level 100 for your next and final rank up. Good luck. Oh yeah! I forgot. You are now able to use the command >Sbsay <what to say> to make the bot speak what you want it to! Try it out!`);
        let perk85Role = message.guild.roles.cache.find(role => role.name === "85");
        message.member.roles.add(perk85Role).catch(console.error);
      }
      else if(curLevel == 100) {
        message.react("🎆");
        message.reply(`You've leveled up to level **${curLevel}**! You are now a Scrub Overlord. This use to be the highest rank possible. I, Tc, the creator of this bot, thank you for being so active on the TurtleSquad discord server. You make our server more popular. Thank you :) You now get a special message when you level up now.`); //change this to a better message.
      }
     else if(curLevel == 250)
     {
       message.react("🎆");
       message.reply(`You've leveled up to level **${curLevel}**! You are now not a scrub. Yes I said it. You are no longer a scrub. This is what we call, Scrubless. You are Scrubless! You have reached level 250. This is an crazy accompishment. Wondering how many messages you need to get to this level? You need about 86,505 messages to get to this level. That is insane! (This is not accounting in holidays that give more points.). Thanks for being so active :)`);
     }
     else if(curLevel == 500)
     {
       message.react("🎆");
       message.reply(`You've reached your limit. You are now level 500. Congrats. You can no longer level up any further. Thank you for being so active I cannot explain how happy I am that you reached this level. Great job. We call this, the Ultimate Turtle Rank.`);
     }
      else if(curLevel > 100 && curLevel < 250) {
        message.react("🎆");
        message.reply(`Hello Scrub Overlord. You have leveled up. You are now level **${curLevel}**! Sorry for bothering you, Overlord.`);
      }
      else if(curLevel > 250 && curLevel < 500)
      {
        message.react("🎆");
        message.reply(`Hi Scrubless. You have leveled up. You are now level **${curLevel}**. Sorry about the tag, thanks for being active!`);
      }
      else if(curLevel > 500){
         pts--;   
      }
    
     if(curLevel <= 500) {
       lvl++;
       if(lvl != 1) {
        message.react("🎊");
        message.reply(`You've leveled up to level **${curLevel}**!`);
       }
     }
     

    }
          if(!(curLevel > 500)) {
       func.setPoints(key, "[" + pts + "] {" + lvl + "}");
     }
  }
  
}

module.exports.help = {
  name: "detect"
}

module.exports.info = {
  type: "script"
}