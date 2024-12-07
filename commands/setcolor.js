const Discord = require("discord.js");
const g = require("../index.js");
const store = require("data-store") ({ path: 'data.json'});

module.exports.run = async (bot, message, args) => {
   let user = message.member;
      let color = args[0];
      if(!g.isColor(color)) return message.reply("This is not a valid color. Please use a valid color!");
      let gm = message.guild.member(user);
      let colorRole = message.guild.roles.cache.get(message.guild.roles.cache.findKey(rl => rl.name === color));
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

    if(!role1)
      {
      user.roles.add(colorRole);
      }
    else {
      console.log(role1);
      let role = message.guild.roles.cache.get(message.guild.roles.cache.findKey(rol1 => rol1.name === role1));
      user.roles.remove(role);
      user.roles.add(colorRole);
    }
      message.react("✅");
}

module.exports.help = {
  name: "setcolor"
}