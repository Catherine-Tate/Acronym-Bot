const Discord = require('discord.js');
var logger = require('winston');
var xml2js = require('xml2js');
var request = require('request');
const auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();

var parser = new xml2js.Parser();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.user.username);
});

bot.on('message', message => {

    if (message.content.substring(0, 1) == '!') {
        var args = message.content.substring(1).split(' ');
        //if(args.length != 1) {
        //    message.channel.send("Needs 1 argument");
        //    return;
        // }
        var cmd = args[0];
       
        //args = args.splice(1);
        switch(cmd) {
            case 'acronym':
                var acro = args[1];
                if(acro == undefined) {
                    message.channel.send("Needs 1 argument");
                    return;
                }
                console.log("Requested acronym for: " + acro);
                if(acro.trim() == "") {
                    break;
                }
                else {
                    var url = " http://acronyms.silmaril.ie/cgi-bin/xaa?" + acro;
                    request(url, function(error, response, body) {
                        parser.parseString(body, function(err, result) {
                            //message.channel.send(result);
                            var expandeds = [];
                            //console.log(result.acronym.found[0].acro[0]);
                            for(var i = 0; i < result.acronym.found[0].acro.length; i++) {
                                console.log(result.acronym.found[0].acro[i].expan);
                                //console.log(entries.expan);
                                expandeds.push(result.acronym.found[0].acro[i].expan);
                            }
                            var num = expandeds.length
                            var msg = "> Found " + num + " results:";
                            for(var i = 0; i < num; i++) {
                                msg += "\n> \t" + expandeds[i];
                            }
                            message.channel.send(msg);
                        })
                    })
                }
            break;
         }
     }
});

bot.login(auth.token);