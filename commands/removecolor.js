const Discord = require("discord.js");
const g = require("../index.js");
const store = require("data-store") ({ path: 'data.json'});

module.exports.run = async (bot, message, args) => {
  let user = message.member;
    let gm = message.guild.member(user.id);
    let role1;
    let num = 0;
    while(store.has(num + "")) {
      let v = store.get(num.toString());
      let r = user.roles.cache.has((message.guild.roles.cache.findKey(roll => roll.name === v)));
      
      if(r)
        {
          role1 = v;
        }
      num++;
    }
    if(role1 === null) return message.reply("You do not have any colors.");
   let role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(rol1 => rol1.name === role1));
    user.roles.remove(role);
  

    message.react("✅");
    
}

module.exports.help = {
  name: "removecolor"
}