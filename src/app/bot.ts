import { Client } from "discord.io"
import * as logger from "winston"
import * as request from "request"
import * as fs from "fs"

const bot = new Client({
    token: "MzQ3NTg3NzU3NjIwNzIzNzEy.DHaj1g.q0zZcHypSyr7UCBLhigxi9umcBI",
    autorun: true
})

logger.info("greetings")

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    logger.info(message);
    
    logger.info(userID)
    let regex = RegExp('<@347587757620723712> (.*)')
    
    let result = regex.exec(message)
    
    if (result !== null && userID !== "347587757620723712" ) {
        if (message.includes("achewood me")) {
            postRandomAchewood(channelID)
        } else {
            
            let weird_message = ""
            
            result[1].split("").forEach(function(c, idx, arr) {            
                weird_message += idx % 2 === 0 ? c.toUpperCase() : c
            })
            
            bot.uploadFile({
                to: channelID,
                file: "img/spongebob.jpg",
                message: weird_message
            })
        }
        
    }
    
    
    
});


function postRandomAchewood(channelID: string) {
    logger.info("gonna achewood")
    
    request("http://www.ohnorobot.com/random.pl?comic=636", function(err, res, body) {    
    let regex = /comic.php\?date\=(\d+)/
    
    let date_slug = regex.exec(body)[1]
    
    logger.info(date_slug)
    
    let filename = date_slug+".gif"
    
    request.get("http://achewood.com/comic.php?date="+date_slug).pipe(fs.createWriteStream(filename)).on("close", function() {
    bot.uploadFile({
        to: channelID,
        file: filename,
        filename: date_slug+".gif"
    })
    
    fs.unlink(filename, function(err) {})
})
})
}




