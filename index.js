const Discord = require("discord.js"); //This requires discord js into the bot. This is REQUIRED.
var replace = require("replace");
const moment = require("moment-timezone");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const store = require("data-store") ({ path: 'commands/data.json'});
const tbans = require("data-store") ({ path: process.cwd() + '/bans.json'});
const tmutes = require("data-store") ({ path: process.cwd() + '/mutes.json'});
const leveling = require("data-store") ({path: "leveling/points.json"});


const sql = require("sqlite"); //Require the NPM sqlite
const proces = require("process");
const cp = require("child_process");
const fs = require("fs");
const Enmap = require("enmap");
const Set = require("es6-set");
const ms = require("ms");
const YTDL = require("ytdl-core");
const TOKEN = process.env.TOKEN; //This is the token for the bot that is required to login to the bot.
const PREFIX = ">"; //This is the prefix of the bot that will trigger it to run commands with the text that is after it.
var bot = new Discord.Client(); //Basically starts the bot;
const version = "0.7";
//sql.open("score.sqlite");
bot.points = new Enmap({name: "points"});
bot.coins = new Enmap({name: "coins"});


bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if(err) console.log(err);
  
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0) {
    console.log("We did not find any commands.");
    return;
  }
  
  jsfile.forEach((f, i) => {
    let props = require("./commands/" + f);
    console.log(f + " has loaded!");
    bot.commands.set(props.help.name, props);
    
  });
}); 


const talkedRecently = new Set();
var servers = {};
function setPoints(id, data) {
  leveling.set(id, data);
}
module.exports.datatoArray = function() {
  let dat = leveling.json();
  let dat2 = dat.substring(1, dat.length); //removes {
  let dat3 = dat2.substring(0, dat.length-2); //removes }
  return dat3.split(",");

  
}
module.exports.setPoints = function(id, data) {
  leveling.set(id, data);
}

module.exports.getPoints = function(id) {
  let data = leveling.get(id);
  return parseInt(data.substring(data.indexOf("[") + 1, data.indexOf("]")));
}

module.exports.getLevel = function(id) {
  let data = leveling.get(id);
  return parseInt(data.substring(data.indexOf("{") + 1, data.indexOf("}")));
}

module.exports.hasData = function(id) {
  return leveling.has(id);
}

module.exports.play = function(connection, message) {
  var server = servers[message.guild.id];
  
  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
  
  server.queue.shift();
  server.dispatcher.on("end", function() {
    if(server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

function play(connection, message) {
  var server = servers[message.guild.id];
  
  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
  
  server.queue.shift();
  server.dispatcher.on("end", function() {
    if(server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

function didYouKnow() {
    var rand = ["Did you know, the owner of the discord server made this bot?", "Did you know, this bot has over 1300 lines of code?", "Did you know, you can ask for a color to be added by putting the hex of the color you want, and the name of the color, and tagging Tc and telling him to add it?", "Did you know, there is a huge logs part of this bot?", "Did you know this discord server is almost a year old? It was made on 9/28/17.", "Did you know, Turtles are hot?", "Did you know, you can partner with this server? (If you are interested, contact Tc/TurtlesAreHot.)", "Did you know, you are a scrub?", "Did you know, the idea of ScrubBot came from Adamy calling everyone scrubs for being inactive?"];

    return rand[Math.floor(Math.random()*rand.length)];
}

function rps() {
  var randchoice = ["r", "p", "s"];
  return randchoice[Math.floor(Math.random()*randchoice.length)];
}
function scrubRate() {
  var scrubRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  return scrubRates[Math.floor(Math.random()*scrubRates.length)];
}



var server1 = cp.fork("commands/data.json");
fs.watchFile('data.json', function (event, filename)
{
    server1.kill();
    console.log('Server1 stopped');
    server1 = cp.fork('data.json');
    console.log('Server1 started');
});

var server2 = cp.fork("bans.json");
fs.watchFile('bans.json', function (event, filename) {
  server2.kill();
  console.log("Server2 stopped");
  server2 = cp.fork('bans.json');
  console.log("Server2 started");
});

var server3 = cp.fork("mutes.json");
fs.watchFile('mutes.json', function (event, filename) {
  server3.kill();
  console.log("Server3 stopped");
  server3 = cp.fork("mutes.json");
  console.log("Server3 started");
});
bot.mutes = new Enmap({name: "mutes"});
bot.bans = new Enmap({name: "bans"});
bot.punishments = new Enmap({name: "punishments"});

setInterval(function() {
  checkTemps();
}, 60000);

module.exports.getMinutes = function(days, hours, minutes) {
  var res = 0;
  if(days == 0 && hours == 0) res = minutes;
  else if(days == 0) res = (hours*60)+minutes;
  else res = ((days*24)*60)+(hours*60)+minutes;
  return res;
}

function getMinutes(days, hours, minutes)
{
  var res = 0;
  if(days == 0 && hours == 0) res = minutes;
  else if(days == 0) res = (hours*60)+minutes;
  else res = ((days*24)*60)+(hours*60)+minutes;
  return res;
}


//a:user
//b:userid
//c:time
//d:guildid
function uban(userid)
{
  var num = 0;
  while(tbans.has(num.toString() + "c")) {
    var id = tbans.get(num.toString() + "b");
    if(userid == id)
    {
      tbans.set(num.toString() + "c", -10);
    }
  }
}

module.exports.umute = function(userid) {
  var num = 0;
  while(tmutes.has(num.toString() + "c")) {
    var id = tmutes.get(num.toString() + "b");
    if(userid == id)
    {
      tmutes.set(num.toString() + "c", -10);
    }
    num++;
  }
}

function umute(userid)
{
  var num = 0;
  while(tmutes.has(num.toString() + "c")) {
    var id = tmutes.get(num.toString() + "b");
    if(userid == id)
    {
      tmutes.set(num.toString() + "c", -10);
    }
    num++;
  }
}
function checkTemps()
{
  var num = 0;
  while(tbans.has(num.toString() + "a")) {
    if(num != 0)
    {
          var v = tbans.get(num.toString() + "c");
        
          v = v-1;
          tbans.set(num.toString() + "c", v);
          if(v <= 0 && !(v <= -10))
          {
            var gd = tbans.get(num.toString() + "d");
            var gld = bot.guilds.cache.find(g => g.id === gd);
            var us = tbans.get(num.toString() + "b");            
            gld.members.unban(us);
            v = -10;
            tbans.set(num.toString() + "c", v);
          
          }
    }
    num++;
  }
  
  var num2 = 0;
  while(tmutes.has(num2.toString() + "a")) {
    if(num2 != 0)
    {
          var v2 = tmutes.get(num2.toString() + "c");
        
          v2 = v2-1;
          tmutes.set(num2.toString() + "c", v2);
          if(v2 <= 0 && !(v2 <= -10))
          {
            var gd2 = tmutes.get(num2.toString() + "d");
            var gld2 = bot.guilds.cache.find(g => g.id === gd2);
            var us2 = tmutes.get(num2.toString() + "b");
            var unm = gld2.members.cache.find(memb => memb.id === us2);
            unm.send("You have been unmuted from " + gld2.name + " for the reason expired mute.");
            let muted = gld2.roles.cache.find(rol => rol.name === "Muted");
            unm.roles.remove(muted).catch(console.error);
            v2 = -10;
            tmutes.set(num2.toString() + "c", v2);


          }
    }
    num2++;
  }
}



module.exports.createBan = function(user, userid, time, guild) {
  var tt = 0;
  if(time.includes("d")) tt = getMinutes(parseInt(time.substring(0, time.indexOf("d"))), 0, 0);
  if(time.includes("h")) tt = getMinutes(0, parseInt(time.substring(0, time.indexOf("h"))), 0);
  if(time.includes("m")) tt = getMinutes(0, 0, parseInt(time.substring(0, time.indexOf("m"))));
  var num = 0;
  while(tbans.has(num.toString() + "a")) {
    num++;
  }
  tbans.set(num.toString() + "a", user);
  tbans.set(num.toString() + "b", userid);
  tbans.set(num.toString() + "c", tt);
  tbans.set(num.toString() + "d", guild);
}

function createBan(user, userid, time, guild)
{
  var tt = 0;
  if(time.includes("d")) tt = getMinutes(parseInt(time.substring(0, time.indexOf("d"))), 0, 0);
  if(time.includes("h")) tt = getMinutes(0, parseInt(time.substring(0, time.indexOf("h"))), 0);
  if(time.includes("m")) tt = getMinutes(0, 0, parseInt(time.substring(0, time.indexOf("m"))));
  var num = 0;
  while(tbans.has(num.toString() + "a")) {
    num++;
  }
  tbans.set(num.toString() + "a", user);
  tbans.set(num.toString() + "b", userid);
  tbans.set(num.toString() + "c", tt);
  tbans.set(num.toString() + "d", guild);
  
}

module.exports.createMute = function(user, userid, time, guild) {
  var tt = 0;
  if(time.includes("d")) tt = getMinutes(parseInt(time.substring(0, time.indexOf("d"))), 0, 0);
  if(time.includes("h")) tt = getMinutes(0, parseInt(time.substring(0, time.indexOf("h"))), 0);
  if(time.includes("m")) tt = getMinutes(0, 0, parseInt(time.substring(0, time.indexOf("m"))));
  var num = 0;
  while(tmutes.has(num.toString() + "a")) {
    num++;
  }
  tmutes.set(num.toString() + "a", user);
  tmutes.set(num.toString() + "b", userid);
  tmutes.set(num.toString() + "c", tt);
  tmutes.set(num.toString() + "d", guild);
}

function createMute(user, userid, time, guild)
{
  var tt = 0;
  if(time.includes("d")) tt = getMinutes(parseInt(time.substring(0, time.indexOf("d"))), 0, 0);
  if(time.includes("h")) tt = getMinutes(0, parseInt(time.substring(0, time.indexOf("h"))), 0);
  if(time.includes("m")) tt = getMinutes(0, 0, parseInt(time.substring(0, time.indexOf("m"))));
  var num = 0;
  while(tmutes.has(num.toString() + "a")) {
    num++;
  }
  tmutes.set(num.toString() + "a", user);
  tmutes.set(num.toString() + "b", userid);
  tmutes.set(num.toString() + "c", tt);
  tmutes.set(num.toString() + "d", guild);
}


module.exports.getColors = function() {
  var num = 0;
  var res = "Colors:\n";
  while(store.has(num.toString())) {
    var v = store.get(num.toString());
    if(num != 0 && num != 1 && num != 2 && num != 3)
    {
      res += v + "\n";
    }
    num++;
  }
  return res;
}
function getColors() {
  var num = 0;
  var res = "Colors:\n";
  while(store.has(num.toString())) {
    var v = store.get(num.toString());
    if(num != 0 && num != 1 && num != 2 && num != 3)
    {
      res += v + "\n";
    }
    num++;
  }
  return res;
}

module.exports.isColor = function(name) {
  var num = 0;
  var res = false;
  while(store.has(num.toString())) {
    var v = store.get(num.toString());
    if(v == name) res = true;
    num++;
  }
  return res;
}

function isColor(name) {
  var num = 0;
  var res = false;
  while(store.has(num.toString())) {
    var v = store.get(num.toString());
    if(v == name) res = true;
    num++;
  }
  return res;
}

module.exports.addColor = function(name) {
  var num = 0;
  while(store.has(num.toString()))
    {
      num++;
    }
  store.set(num.toString(), name);
  store.save();
}
function addColor(name) {
  var num = 0;
  while(store.has(num.toString()))
    {
      num++;
    }
  store.set(num.toString(), name);
  store.save();
}

function changeFile(text, file)
{
  var currentPath = process.cwd();
  replace({
    regex: readTextFile(file),
    replacement: readTextFile(file) + text,
    paths: [currentPath + '/' + file],
    recursive: true,
    silent: true,
});
}

function readTextFile(file)
{
  file = "file:" + file;
  var text = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                text = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
  return text;
}

function printKeys(map){
  var res = "";
  for(var i = 0; i < map.size; i++)
  {
    res = map[i] + "\n";
  }
  return res;
  
}

module.exports.getTime = function() {
  var today = new Date();
    var mytz = "America/Toronto";
    var myDatetimeFormat = "YYYY-MM-DD hh:mm:ss a z";
    var myDatetimeString = moment(today).tz(mytz).format(myDatetimeFormat);
    return myDatetimeString;
}

function getTime()
{
    var today = new Date();
    var mytz = "America/Toronto";
    var myDatetimeFormat = "YYYY-MM-DD hh:mm:ss a z";
    var myDatetimeString = moment(today).tz(mytz).format(myDatetimeFormat);
    return myDatetimeString;
}

let client = bot;
bot.on("ready", function() {
  var g = new RichEmbedewqweeqw();
  console.log("ScrubBot Reloaded has started on version " + version);
  bot.user.setActivity('>help', { type: 'LISTENING' });
});

bot.on("guildMemberAdd", member => {
  const guild = member.guild;
  let msstring = member.displayName;
  if(msstring.toString().includes("discord.gg/") || 
     msstring.toString().includes('discord.me') ||
     msstring.toString().includes('paypal.me') ||
     msstring.toString().includes('twitter.com') ||
     msstring.toString().includes("selly.gg") ||
     msstring.toString().includes("twitch.tv/")) {
      return guild.member(member).ban("Advertising via joining and leaving the server. [AUTO BAN]");
  }
  else
  {
      let jm = `Welcome to ${guild}, ${member}! Use the command >getrole in #bot-spam to get your turtle role!`;
        guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "welcome")).send(jm).catch(console.error);

  }
     
});

bot.on("guildMemberRemove", member => {
  let guild = member.guild;
  let msstring = member.displayName;
  if(msstring.toString().includes("discord.gg/") || 
     msstring.toString().includes('discord.me') ||
     msstring.toString().includes('paypal.me') ||
     msstring.toString().includes('twitter.com') ||
     msstring.toString().includes("selly.gg") ||
     msstring.toString().includes("twitch.tv/")) {
      return guild.member(member).ban("Advertising via joining and leaving the server. [AUTO BAN]");
  }
  else
  {
      let guild = member.guild;
      let lm = `Bye ${member}! Please come back another time! We will miss ya, scrub.`;
      guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "welcome")).send(lm).catch(console.error);
  }
     
});
bot.on("guildBanRemove", (guild, user) => {
  var time = getTime();
  var pfp = user.avatarURL();  
  var bem = new Discord.MessageEmbed()
    .setTitle("was unbanned from the server.")
    .setAuthor(user.tag, pfp)
    .setDescription("Unbanned at:\n```" + time + "```")
    .setColor(0x00AE86);
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(bem).catch(console.error);
  
});

bot.on("channelCreate", (channel) => {
  var time = getTime();
  var client2 = channel.client;
  var type = channel.type;
  if(type == "dm") return;
  var id = channel.name
  var cc = new Discord.MessageEmbed()
  
    .setTitle("A channel was created!")
    .setDescription("Channel:\n```" + id + "```\nCreated at:\n```" + time + "```\nChannel Type:\n```" + type + "```")
    .setColor(0x00AE86);
  var guild = client2.guilds.cache.get(client2.guilds.cache.findKey(g => g.name === "Turtle Squad"));
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(cc).catch(console.error);
  
});

bot.on("channelDelete", (channel) => {
  var time = getTime();
  var client2 = channel.client;
  var type = channel.type;
  if(type == "dm") return;
  var id = channel.name;
  var cc = new Discord.MessageEmbed()
  
    .setTitle("A channel was deleted!")
    .setDescription("Channel:\n```" + id + "```\nDeleted at:\n```" + time + "```\nChannel Type:\n```" + type + "```")
    .setColor(0x00AE86);
  var guild = client2.guilds.cache.get(client2.guilds.cache.findKey(g => g.name === "Turtle Squad"));
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(cc).catch(console.error);
  
});

bot.on("guildMemberUpdate", (oldMember, newMember) => {
  if(oldMember.user.bot) return;
  var time = getTime();
  var pfp = oldMember.user.avatarURL();
  var id = oldMember.id;
  var guild = oldMember.guild;
  var name = guild.members.cache.get(guild.members.cache.findKey(m => m.id === id));
  var oldNick = oldMember.nickname;
  var oldRoles =  oldMember.roles.cache.map(role => role.name);
  var newNick = newMember.nickname;
  var newRoles = newMember.roles.cache.map(role => role.name);
  if(oldNick == null) oldNick = "user has no nickname";
  if(newNick == null) newNick = "user has no nickname";
    if(oldNick == newNick && oldRoles == newRoles) return;
  var gmu = new Discord.MessageEmbed()
    .setTitle("was updated.")
    .setAuthor(oldMember.user.tag, pfp)
    .setDescription("Old Nickname:\n```" + oldNick + "```\nOld roles:\n```" + oldRoles + "```\nNew Nickname:\n```" + newNick + "```\nNew roles:\n```" + newRoles + "```\nDone at:\n```" + time + "```")
    .setColor(0x00AE86);
  var guild = oldMember.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(gmu).catch(console.error);
  
});


bot.on("messageDelete", message => {
  var cont = message.content;
  var time = getTime();
  var auth = message.author.tag;
  var pfp = message.author.avatarURL();
  var guild = message.guild;
  var channel = message.channel.name;
  var md = new Discord.MessageEmbed()
    .setTitle("The above users message was deleted in the channel " + channel)
    .setAuthor(auth, pfp)
    .setDescription("Message:\n```" + cont + "```\nDeleted at:\n```" + time + "```")
    .setColor(0x00AE86);
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(md).catch(console.error);
  
  
});

bot.on("messageReactionRemoveAll", message => {
  var time = getTime();
  var msg = message.content;
  var channel = message.channel.name;
  var mrra = new Discord.MessageEmbed()
    .setTitle("A user has removed all reactions from a message.")
    .setDescription("Message:\n```" + msg + "```\nIn channel:\n```" + channel + "```At:\n```" + time + "```")
    .setColor(0x00AE86);
  var guild = message.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(mrra).catch(console.error);
});

bot.on("messageReactionRemove", (messageReaction, user) => {
  console.log("go");
  var time = getTime();
  var us = user.username;
  var from = messageReaction.message.content;
  var react = messageReaction.emoji.name;
  var channel = messageReaction.message.channel.name;
  var mrr = new Discord.MessageEmbed()
    .setTitle("A user removed their reaction from a message.")
    .setDescription("Reaction:\n```" + react + "```\nRemoved from:\n```" + from + "```\nWhich was reacted by:\n```" + us + "```\nAt:\n```" + time + "```\nIn channel:\n```" + channel + "```")
    .setColor(0x00AE86);
  
  var guild = messageReaction.message.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(mrr).catch(console.error);
  
});

bot.on("messageUpdate", (oldMessage, newMessage) => {
  if(oldMessage.author.bot) return;
  var author = oldMessage.author.tag;
  var pfp = oldMessage.author.avatarURL();
  var oldmsg = oldMessage.content;
  var newmsg = newMessage.content;
  if(newmsg == "" || oldmsg == "") return;
  if(oldmsg == newmsg) return;
  var channel = oldMessage.channel.name;
  var time = getTime();
  var mu = new Discord.MessageEmbed()
    .setTitle("The above users message was edited.")
    .setAuthor(author, pfp)
    .setDescription("Old message:\n```" + oldmsg + "```\nNew message:\n```" + newmsg + "```\nAt:\n```" + time + "```\nIn channel:\n```" + channel + "```")
    .setColor(0x00AE86);
  var guild = oldMessage.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(mu).catch(console.error);
});

bot.on("roleCreate", role => {
  var base10color = role.color;
  var hexcolor = role.hexColor;
  var diffpos = role.hoist;
  var id = role.id;
  var men = role.mentionable;
  var name = role.name;
  var perms = role.permissions;
  var time = getTime();
  //https://finitereality.github.io/permissions-calculator/?v=
  var rc = new Discord.MessageEmbed()
    .setTitle("A new role has been created!")
    .setDescription("Name:\n```" + name + "```\nID:\n```" + id + "```\nBase 10 color:\n```" + base10color + "```\nHex color:\n```" + hexcolor + "```\nDisplay seperately from other roles:\n```" + diffpos + "```\nMentionable:\n```" + men + "```\nPermisions:\n```" + perms + "```\nCreated at:\n```" + time + "```")
    .addField("Permissions:", "https://finitereality.github.io/permissions-calculator/?v=" + perms)
    .setColor(0x00AE86);
  var guild = role.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(rc).catch(console.error);
});

bot.on("roleDelete", role => {
  var base10color = role.color;
  var hexcolor = role.hexColor;
  var diffpos = role.hoist;
  var id = role.id;
  var men = role.mentionable;
  var name = role.name;
  var perms = role.permisisons;
  var time = getTime();
  //https://finitereality.github.io/permissions-calculator/?v=
  var rc = new Discord.MessageEmbed()
    .setTitle("A role has been deleted!")
    .setDescription("Name:\n```" + name + "```\nID:\n```" + id + "```\nBase 10 color:\n```" + base10color + "```\nHex color:\n```" + hexcolor + "```\nDisplay seperately from other roles:\n```" + diffpos + "```\nMentionable:\n```" + men + "```\nPermisions:\n```" + perms + "```\nDeleted at:\n```" + time + "```")
    .addField("Permissions:", "https://finitereality.github.io/permissions-calculator/?v=" + perms)
    .setColor(0x00AE86);
  var guild = role.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(rc).catch(console.error);
});

bot.on("roleUpdate", (oldRole, newRole) => {
  var oldpos = oldRole.position;
  var newpos = newRole.position;
  if(oldpos != newpos) return;
  var oldbase10color = oldRole.color;
  var oldhexcolor = oldRole.hexColor;
  var olddiffpos = oldRole.hoist;
  var oldmen = oldRole.mentionable;
  var oldname = oldRole.name;
  var oldperms = oldRole.permissions;
  var newbase10color = newRole.color;
  var newhexcolor = newRole.hexColor;
  var newdiffpos = newRole.hoist;
  var newmen = newRole.mentionable;
  var newname = newRole.name;
  var newperms = newRole.permssions;
  var time = getTime();
  //https://finitereality.github.io/permissions-calculator/?v=
  var rc = new Discord.MessageEmbed()
    .setTitle("A new role has been updated!")
    .setDescription("Old name:\n```" + oldname + "```\nOld base 10 color:\n```" + oldbase10color + "```\nOld hex color:\n```" + oldhexcolor + "```\nOld display seperately from other roles:\n```" + olddiffpos + "```\nOld mentionable:\n```" + oldmen + "```\nOld perms:\n```" + oldperms + "```\nNew name:\n```" + newname + "```\nNew base 10 color:\n```" + newbase10color + "```\nNew hex color:\n```" + newhexcolor + "```\nNew display seperately from other roles:\n```" + newdiffpos + "```\nNew mentionable:\n```" + newmen + "```\nNew perms:\n```" + newperms + "```\nUpdated at:\n```" + time + "```")
    .addField("Old Permissions:", "https://finitereality.github.io/permissions-calculator/?v=" + oldperms)
    .addField("New Permissions:", "https://finitereality.github.io/permissions-calculator/?v=" + newperms)
    .setColor(0x00AE86);
  var guild = oldRole.guild;
  guild.channels.cache.get(guild.channels.cache.findKey(cn => cn.name === "logs")).send(rc).catch(console.error);
});


bot.on("message", message => {
  var guild = message.guild;
  if (message.author.bot) return;
 
  
  let cfile = bot.commands.get("detect");
  let dfile = bot.commands.get("updatetop");
  
  if(cfile) cfile.run(bot, message);
  if(dfile) dfile.run(message, bot);
  
  let msg = message.toString();

  if (message.content.indexOf(PREFIX) !== 0) {
    return;
  }
  
  function send(text) {
    message.channel.send(text);
  }
  function sendTo(text, channel)
  {
    guild.channels.find("name", channel).send(text).catch(console.error);
  }
  function log(text)
  {
    let guild = message.guild;
    guild.channels.find("name", "logs").send(text).catch(console.error);
  }
  function dm(user, text)
  {
    message.guild.member(user).sendMessage(text)
  }
  if(message.content.substring(0, 2) == "> ") return;
  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  let cmd = command;
  if(cmd == " " || cmd == "") return;
  let broken = false;
  if(cmd === "detect" || cmd === "updatetop") return message.reply("Invalid command, type >help for all the commands.");
  if (cmd === "reload") {
    let dead = new Discord.RichEmbedwe9rwe();
  }
  else if(command === "setpoints") {
    let client = bot;
        if(message.member.id != 244493250671542272) 
      return message.reply("Invalid command. Type >help to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
     if(!user) return message.reply("You must mention someone or give their ID!");
    const pointsToSet = parseInt(args[1], 10);
    if(!pointsToSet) 
      return message.reply("You didn't tell me how many points to set to..")
    // Ensure there is a points entry for this user.
    // Get their current points.
    const key = "[" + user.id + "] {" + message.guild.id + "}";
    const curlvl = Math.floor(0.85 * Math.sqrt(pointsToSet));
    const dat = "[" + pointsToSet + "] {" + curlvl + "}";
    // And we save it!
    setPoints(key, dat);
    message.channel.send(`${user.tag} has had their points set to ${pointsToSet}.`);
  }
  else {
    let cmdfile = bot.commands.get(cmd);
    if(cmdfile) cmdfile.run(bot, message, args);
    else message.reply("Invalid command, type >help for all the commands.");

  }
  if(broken) {
  var embed;
  if (cmd === "help") {
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
      .addField(">help music", "displays all of the music commands.")
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
    else if(a === "music") {
            embed = new Discord.MessageEmbed()
      .setColor("#FFFF00")
      .setTitle("ScrubBot Music Help")
      .setDescription("This is all of the music commands.")
      .addField(">play <song url>", "plays the audio of the url. Must be in voicechat to use this command.")
      .addField(">skip", "skips the current song playing in the queue If no songs left in the queue, it will disconnect. Must be in voicechat to use this command.")
      .addField(">stop", "stops the current song playing and disconnects the bot from the voice channel. Queue gets cleared. Must be in voicechat to use this command.");
      
    
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
  else if (cmd === "reload") {
    var dead = new Discord.ricewrewrwerwe();
  }
  else if (cmd === "ban")
  {
    let guild = message.guild;
    let gd = message.guild.name;
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission BAN_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to ban. >ban <user> [reason]");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    if(user2.hasPermission("BAN_MEMBERS")) return message.reply("This user cannot be banned as they have the BAN_MEMBERS permission.");
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot ban yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was banned!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been banned from " + gd + " for" + reason)
        .then(() => {
        gm.ban(reason);
    message.react("✅");
      });
    });    
      
  }
  else if (cmd === "tempban")
  {
    let gd = message.guild.name;
    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission BAN_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to ban. >tempban <user> <length (<amount>d for hours <amount>h for minutes <amount>m)> [reason]");
    if(user2.hasPermission("BAN_MEMBERS")) return message.reply("This user cannot be muted as they have the BAN_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let length = args[1];
    if(!length) return message.reply("Please specify a length. For days <amount>d for hours <amount>h for minutes <amount>m");
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot ban yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was banned!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```\nLength:\n```" + length + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been banned in " + gd + " for" + reason + " for " + length + ". You will not be notified when you are unbanned.")
        .then(() => {
        gm.ban(reason);
        createBan(name, userid, length, message.guild.id);
        message.react("✅");
      });
    });  
  }
  else if (cmd === "mute")
  {
    let gd = message.guild.name;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to mute. >tempmute <user> [reason]");
    if(user2.hasPermission("KICK_MEMBERS")) return message.reply("This user cannot be muted as they have the KICK_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot mute yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was muted!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been muted in " + gd + " for" + reason)
        .then(() => {
        let muted = message.guild.roles.find("name", "Muted");
        gm.addRole(muted).catch(console.error);
        message.react("✅");
      });
    });  
  }
  else if (cmd === "tempmute")
  {
    let gd = message.guild.name;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to mute. >mute <user> <length (<amount>d for hours <amount>h for minutes <amount>m)> [reason]");
    if(user2.hasPermission("KICK_MEMBERS")) return message.reply("This user cannot be muted as they have the KICK_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let length = args[1];
    if(!length) return message.reply("Please specify a length. For days <amount>d for hours <amount>h for minutes <amount>m");
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot mute yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was muted!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```\nLength:\n```" + length + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been muted in " + gd + " for" + reason + " for " + length)
        .then(() => {
        let muted = message.guild.roles.find("name", "Muted");
        gm.addRole(muted).catch(console.error);
        createMute(name, userid, length, message.guild.id);
        message.react("✅");
      });
    });  
  }
  else if (cmd === "unmute")
  {
    let gd = message.guild.name;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to mute. >unmute <user> [reason]");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = getTime();
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was unmuted!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been unmuted in " + gd + " for" + reason)
        .then(() => {
        let muted = message.guild.roles.find("name", "Muted");
        gm.removeRole(muted).catch(console.error);
        umute(userid);
        message.react("✅");
      });
    }); 
  }
  else if (cmd === "warn")
  {
    let gd = message.guild.name;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to warn. >warn <user> [reason]");
    if(user2.hasPermission("KICK_MEMBERS")) return message.reply("This user cannot be warned as they have the KICK_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot warn yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was warned!")
      .setAuthor(tg, pfp)
      .setDescription("Reason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been warned by the server " + gd + " for" + reason)
        .then(() => {
    message.react("✅");
      });
    });  
  }
  else if (cmd === "kick")
  {
      let gd = message.guild.name;
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("No permission! Think this is an error? Make sure you have the permission KICK_MEMBERS");
    let user2 = message.guild.member(message.mentions.users.first());
    if(!user2) return message.reply("Please give us someone to kick. >kick <user> [reason]");
    if(user2.hasPermission("KICK_MEMBERS")) return message.reply("This user cannot be kicked as they have the KICK_MEMBERS permission.");
    let userid = user2.id;
    let name = guild.members.find("id", userid).displayName;
    let reason = args.join(" ").slice(22);
    if(!reason) reason = "Breaking rules [DEFAULT]";
    let length = "none";
    let creator = message.author.username;
    let time = getTime();
    if(creator == user2) return message.reply("You cannot kick yourself!");
    let pfp = user2.avatarURL;
    let tg = user2.tag;
    var elog = new Discord.MessageEmbed()
      .setTitle("was kicked!")
      .setAuthor(tg, pfp)
      .setDescription("User:\n```" + "<@" + name + ">"+ "```\nReason:\n```" + reason + "```\nBy:\n```" + creator + "```At:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(elog).catch(console.error);
    let gm = message.guild.member(user2);
    gm
      .createDM()
      .then((DMChannel) => {
      DMChannel
        .send("You have been kicked from " + gd + " for" + reason)
        .then(() => {
        gm.kick(reason);
    message.react("✅");
      });
    });  
  }
  else if (cmd === "prune")
  {
    let user = message.member;
    if(!user.hasPermission("MANAGE_MESSAGES")) return message.reply("No permission! Think this is an error? Make sure you have the permission MANAGE_MESSAGES");
    let channel = message.channel;
    let ammount = args.join(' ');
    if(!ammount) return message.reply("Please specify the amount that you want to delete.");
    if(isNaN(ammount)) return message.reply("The amount paramater is not a number! It needs to be a number.");
    if(ammount > 100) return message.reply("You cannot delete more than 100 messages at once.");
    if(ammount < 1) return message.reply("You can delete 1 message yourself.");
    let allmsges = message.channel.fetchMessages({limit: ammount}).then(messages => {
      message.channel.bulkDelete(messages)
    });
    var time = getTime();
    let le = new Discord.MessageEmbed()
      .setTitle("Messasges were pruned!")
      .setDescription("Channel:\n```" + message.channel.name + "```By:\n```" + message.author.tag + "```\nAt:\n```" + time + "```")
      .setColor(0x00AE86);
    guild.channels.find("name", "logs").send(le).catch(console.error);
    
    
  }
  else if (cmd === "createcolor" || cmd === "createcolour")
  {
    let user = message.member;
    if(!user.hasPermission("MANAGE_ROLES")) return message.reply("No permission! Think this is an error? Make sure you have the permission MANAGE_ROLES");
    let name = args[0];
    let color = args[1];
    let guild = message.guild;
    let role = message.guild.roles.find("name", name);
    if(role) return message.reply("A role color already has this name, please use another name!");
    try {
      role = message.guild.createRole({
        name: name,
        color: color,
        permissions:[]
      });
      addColor(name);
      message.react("✅");
    }
    catch(e) {
      console.log(e.stack);
    }
    
    
  }
  else if (cmd === "setcolor" || cmd === "setcolour")
  {
      let user = message.member;
      let color = args[0];
      if(!isColor(color)) return message.reply("This is not a valid color. Please use a valid color!");
      let gm = message.guild.member(user);
      let colorRole = message.guild.roles.find("name", color);
      let role;
      let num = 0;
      while(store.has(num.toString())) {
      let v = store.get(num.toString());
      let r = gm.roles.find("name", v);
      if(r)
        {
          role = r;
        }
      num++;
    }
    if(role === null)
      {
      gm.addRole(colorRole);
      }
    else {
      gm.removeRole(role);
      gm.addRole(colorRole);
    }
      message.react("✅");
  }
  else if (cmd === "removecolor" || cmd === "removecolour")
  {
    let user = message.member;
    let gm = message.guild.member(user.id);
    let role;
    let num = 0;
    while(store.has(num.toString())) {
      let v = store.get(num.toString());
      let r = gm.roles.find("name", v);
      if(r)
        {
          role = r;
        }
      num++;
    }
    if(role === null) return message.reply("You do not have any colors.");
    gm.removeRole(role);
    message.react("✅");
    
  }
  else if (cmd === "colors" || cmd === "colours") 
  {
    message.reply(getColors());
  }
  else if (command === "level") {
    let lUser = message.mentions.users.first() || client.users.get(args[0]);
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
      pfp = lUser.avatarURL;
      u = lUser.tag;
    }
    else
    {
      pfp = lUser.user.avatarURL;
      u = lUser.user.tag;
    }
    let SbRank;
    let NextRank;
    let rankType;
    const key = `${message.guild.id}-${lUser.id}`;
    let lvl = bot.points.get(key, "level");
    let pts = bot.points.get(key, "points");
    let sc = bot.coins.get(key, "coins");
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
      .setAuthor(u, pfp)
      .addField(`They are level: `, `${lvl}`)
      .addField(`They have: `, `${pts} points`)
      .addField(`Their Current Rank: `, `${SbRank}`)
      if(nextlvl != "N/A") levelembed.addField(`Their Next level: `, `${pts}/${nextlvl}`)
      else levelembed.addField("Their next level:", "N/A")
      .addField("Points Until Next Level:", `${untilnextlvl}`)
      .addField("Next Rank:", `${NextRank}`)
      .addField("Rank Type:", `${rankType}`)
      .addField("Scrub Coins:", `${sc}`);
    message.channel.send(levelembed);
  }
  else if(command === "top") {
    // Get a filtered list (for this guild only), and convert to an array while we're at it.
    const filtered = client.points.filter( p => p.guild === message.guild.id ).array();
    // Sort it to get the top results... well... at the top. Y'know.
    const sorted = filtered.sort((a, b) => b.points - a.points);
    // Slice it, dice it, get the top 10 of it!
    const top10 = sorted.splice(0, 10);
    // Now shake it and show it! (as a nice embed, too!)
    const embed = new Discord.MessageEmbed()
      .setTitle("Leaderboard")
      .setAuthor(client.user.username, client.user.avatarURL)
      .setDescription("Our top 10 points leaders!")
      .setColor(0x00AE86);
    for(const data of top10) {
      let us = message.guild.members.find("id", data.user);
      if(us != null)
      {
        let gld = bot.guilds.find("id", data.guild);
        let uss = gld.members.find("id", data.user);
        embed.addField(us.user.tag, `${data.points} points and level ${data.level}`);
      }
    }
    return message.channel.send({embed});
  }
  else if (command === "ranks") {
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
  else if (command === "info") {
    message.reply("This is the ScrubBot created by Tc. This bot is only for TurtleSquad and my Testing server. You cannot invite this bot to other servers. If you found this on another server, please report it to us. Thank you. This bot is for leveling on TurtleSquad.");
  }
  else if (command === "links") {
    message.channel.send("TurtleSquad Links\nWebsite: https://turtlesquad.tk \nBan Appeals: https://turtlesquad.tk/StaffApps/ \nBan Appeals: https://turtlesquad.tk/BanAppeals/ \n Rules: https://turtlesquad.tk/Rules/");
  }
  else if (command === "scrub") {
    let errorembed;
    let perk45Role = message.guild.roles.find("name", "45");
    if(!perk45Role) return message.reply("An error has occured.");
    if(message.member.roles.has(perk45Role.id))
    {
      let usersc = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      message.channel.send(`${usersc} you're a scrub.`);
    }
    else message.reply("You are not able to use this command. You must be level 45 on scrub bot!");  
  }
  else if(command === "give") {
    let client = bot;
    // Limited to guild owner - adjust to your own preference!
    if(message.author.id !== message.guild.ownerID) 
      return message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.get(args[0]);
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
    let userPoints = client.points.get(`${message.guild.id}-${user.id}`, "points");
    userPoints += pointsToAdd;
    
    // And we save it!
    client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points")
    message.channel.send(`${user.tag} has received ${pointsToAdd} points and now stands at ${userPoints} points.`);
  }
    
  else if(command === "setpoints") {
    let client = bot;
        if(message.author.id !== message.guild.ownerID) 
      return message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.cache.get(args[0]);
     if(!user) return message.reply("You must mention someone or give their ID!");
    const pointsToSet = parseInt(args[1], 10);
    if(!pointsToSet) 
      return message.reply("You didn't tell me how many points to remove..")
    // Ensure there is a points entry for this user.
    client.points.ensure(`${message.guild.id}-${user.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    // Get their current points.
    let userPoints = client.points.get(`${message.guild.id}-${user.id}`, "points");
    userPoints = pointsToSet;
    
    // And we save it!
    client.points.set(`${message.guild.id}-${user.id}`, userPoints, "points")
    message.channel.send(`${user.tag} has had their points set to ${pointsToSet}.`);
  }
  else if(command === "removecoins") {
    let client = bot;
    // Limited to guild owner - adjust to your own preference!
    if(message.author.id !== message.guild.ownerID) 
      return message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");
    const user = message.mentions.users.first() || client.users.get(args[0]);
    if(!user) return message.reply("You must mention someone or give their ID!");
    const pointsToRemove = parseInt(args[1], 10);
    if(!pointsToRemove) 
      return message.reply("You didn't tell me how many coins to remove..")
    // Ensure there is a points entry for this user.
    client.points.ensure(`${message.guild.id}-${user.id}`, {
      user: message.author.id,
      guild: message.guild.id,
      points: 0,
      level: 1
    });
    // Get their current points.
    let userCoins = client.coins.get(`${message.guild.id}-${user.id}`, "coins");
    userCoins -= pointsToRemove;
    
    // And we save it!
    client.coins.set(`${message.guild.id}-${user.id}`, userCoins, "coins")
    message.channel.send(`${user.tag} has lost ${pointsToRemove} coins and now stands at ${userCoins} coins.`);
  }
  else if(command === "cleanup") {
    let client = bot;
    // Let's clean up the database of all "old" users, 
    // and those who haven't been around for... say a month.
    // Get a filtered list (for this guild only).
    const filtered = client.points.filter( p => p.guild === message.guild.id );
    // We then filter it again (ok we could just do this one, but for clarity's sake...)
    // So we get only users that haven't been online for a month, or are no longer in the guild.
    const rightNow = new Date();
    const toRemove = filtered.filter(data => {
      return !message.guild.members.has(data.user) || rightNow - 2592000000 > data.lastSeen;
    });
    toRemove.forEach(data => {
      client.points.delete(`${message.guild.id}-${data.user}`);
    });
    message.channel.send(`I've cleaned up ${toRemove.size} old farts.`);
  }
  else if(command === "say") {  
    if(message.member.roles.cache.some(role => role.name === "85")) {
      let sayMessage = args.join(" ").slice(0);
      if(!sayMessage) return message.channel.send("Invalid arguments. Correct ussage: >Sbsay <message>");
      message.channel.send(sayMessage);
    }
    else return message.reply("You must be level 85 on scrub bot to run this command!");
  }
  else if(command === "getrole")
    {
      let role = message.guild.roles.find("name", "Turtle");
      message.member.addRole(role).catch(console.error);
      message.react("✅");
    }
  else if(command === "user") {
    let uUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!uUser) return message.reply("Please tag someone. Tag yourself to list your own information.");
    let pfp = uUser.user.avatarURL;
    let u = uUser.user.tag;
    var profile = new Discord.MessageEmbed()
    .setTitle("Profile")
    .setAuthor(u, pfp)
    .setDescription("User Information")
    .setColor(0x00AE86)
    .addField("Bannable:", `${uUser.bannable}`)
    .addField("Kickable:", `${uUser.kickable}`)
    .addField("Manageable:", `${uUser.manageable}`)
    .addField("Role Color:", `${uUser.colorRole}`)
    .addField("Nickname [if none username]:", `${uUser.displayName}`)
    .addField("Highest Role:", `${uUser.highestRole}`)
    .addField("Join time:", `${uUser.joinedAt}`)
    .addField("Join Timestamp:", `${uUser.joinedTimestamp}`)
    .addField("Last Message:", `${uUser.lastMessage}`);
    message.channel.send(profile).catch(console.error);

  }
  else if(command === "didyouknow") {
    let dyk = didYouKnow();
    if(!dyk) return message.reply("Something went wrong. Please contact @Tc");
    message.reply(dyk);
  }
  else if(command === "scrubrate") {
    let msg = message;
    if (talkedRecently.has(msg.author.id)) {
            msg.channel.send("Wait 1 minute before typing this again. - " + msg.author);
    } else {

           // the user can type the command ... your command code goes here :
          let perk45Role = message.guild.roles.find("name", "45");
          if(!perk45Role) return message.reply("You are not the correct level to be able to do this. You need to 45 role to use this command. If this is an error contact an administrator.");
          if(message.member.roles.has(perk45Role.id)) {
          let scrubrateuser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
          if(!scrubrateuser) scrubrateuser = message.member;
          let scrubrate = scrubRate();
          let pfp = scrubrateuser.user.avatarURL;
          let u = scrubrateuser.user.tag;
          var scrubrateembed = new Discord.MessageEmbed()
          .setTitle("Scrub Rate")
          .setAuthor(u, pfp)
          .setDescription("This is a randomly generated percentage on what percentage of a scrub they are.\nScrub Rate:\n```" + scrubrate + "%```")
          .setColor(0x00AE86)
          message.channel.send(scrubrateembed);
        }
        else return message.reply("You must be atleast level 45 on scrub bot to use this command!");
        // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(msg.author.id);
        }, 60000);
    }
  }
  
  else {
    message.reply("Invalid command. Type >Sbhelp to list all the commands ya scrub.");    

  }
  }
  
  
  
  
  
  
});
//bot.on('debug', console.log); (for debug purposes only)
bot.login(TOKEN);
process.on('unhandledRejection', console.error);
