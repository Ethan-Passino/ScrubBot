const g = require("../index.js");
const Discord = require("discord.js");

module.exports.run = async (message, bot) => {
  let chnl = message.guild.channels.cache.get(message.guild.channels.cache.findKey(cn => cn.name === "top"));
  if(!chnl) return;

  // Get a filtered list (for this guild only), and convert to an array while we're at it.
    const data = g.datatoArray(); //getting the data from points.json.

    //filter data so we only have data in this guild.
      let filtered = [];
  data.forEach(p => {
    if(p.includes(message.guild.id)) filtered.push(p.substring(4, p.indexOf(':')-1)); //adds the key to the array.)
  });
  //console.log(filtered);
    //console.log(filtered);

  //for(const p in data) {
   // console.log(p);
    //let q = p.substring(p.indexOf("{"))
    //if(p.includes("" + message.guild.id)) filtered.push(p.substring(1, p.indexOf(':')-2)); //adds the key to the array.
  //}
  let full = [];
  filtered.forEach(h => {
    //console.log(h);
    full.push(h + "-" + g.getPoints(h));
  });
  //console.log(full);
    // Sort it to get the top results... well... at the top. Y'know.
  //console.log(full);
  let sorted = [];
  let num = 0;
  function getLast(str) {
    return parseInt(str.substring(str.indexOf("-") + 1));
  }
  let ok1 = full[0];
  let ok2 = full[1];
  full[0] = ok2;
  full[1] = ok1;
  //console.log(full);
  full.forEach(o => {
    if(sorted.length == 0) sorted.push(o);
    else {
      let pos = 0;
      for(let j = 0; j < sorted.length; j++) {
        let val = sorted[j];
        if(getLast(o + "") > getLast(val + "")) {
          pos = j;

          break;
        }
      }
    if(pos==0) sorted.splice(sorted.length, 0, o+"") 
      else sorted.splice(pos, 0, o +"");
      pos = 0;
    }
  });
  //console.log(sorted);
  if(sorted.length == 1) sorted = full;
  //console.log(sorted);
  for(let w = 0; w < sorted.length; w++) {
    sorted[w] = sorted[w].substring(0, sorted[w].indexOf("-"));
  }
  // Slice it, dice it,get the top 10 of it!
  //console.log(sorted);
    const top10 = (sorted.splice(0, 10));
  //console.log(top10);
    // Now shake it and show it! (as a nice embed, too!)
    const embed = new Discord.MessageEmbed()
      .setTitle("Leaderboard")
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setDescription("Our top 10 points leaders!")
      .setColor(0x00AE86);
  //console.log(top10);
    top10.forEach(data => {
      

        let gld = bot.guilds.cache.find(g => g.id === data.substring(data.indexOf("{") + 1, data.indexOf("}")));
        let uss = gld.members.cache.find(usr => usr.id === data.substring(data.indexOf("[") + 1, data.indexOf("]")));
        if(uss != null) {
          embed.addField(uss.user.tag, g.getPoints(data) + " points and level " + g.getLevel(data));
        }
    });
  return chnl.messages.fetch("845009720522833920").then(mg => mg.edit(embed)).catch(console.error);
}

module.exports.help = {
  name: "updatetop"
}

module.exports.info = {
  type: "script"
}