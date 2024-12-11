const process = require("process");
require('dotenv').config();
const Discord = require("discord.js"); //This requires discord js into the bot. This is REQUIRED.
var replace = require("replace");
const moment = require("moment-timezone");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const store = require("data-store") ({ path: 'commands/data.json'});
const tbans = require("data-store") ({ path: process.cwd() + '/bans.json'});
const tmutes = require("data-store") ({ path: process.cwd() + '/mutes.json'});
const leveling = require("data-store") ({path: "leveling/points.json"});


const sql = require("sqlite"); //Require the NPM sqlite
const cp = require("child_process");
const fs = require("fs");
const Enmap = require('enmap');
//import Enmap from 'enmap';
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
  
  let msg = message.toString()
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
  console.log("2");
  if(message.content.substring(0, 2) == "> ") return;
  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/ +/g);
  console.log("3");

  const command = args.shift().toLowerCase();
  let cmd = command;
  if(cmd == " " || cmd == "") return;
  console.log("4");

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
    console.log("5");

    if(cmdfile) cmdfile.run(bot, message, args);
    else message.reply("Invalid command, type >help for all the commands.");

  }

  
  
  
});
//bot.on('debug', console.log); (for debug purposes only)
bot.login(TOKEN);
process.on('unhandledRejection', console.error);
