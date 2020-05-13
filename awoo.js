const Discord = require('discord.js');
const client = new Discord.Client();

init();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('protogens party', {
        type: 'WATCHING'
    });
});

let items = [{
        name: "Flowers",
        price: 25,
    },
    {
        name: "Chocolate",
        price: 10,
    },
    {
        name: "Stuffie",
        price: 40,
    },
];

let waifus = [{
        name: "Sano Hikaru",
        images: [""],
        personality: "Calm yet Radiant",
        gender: "Male",
        mult: 1,

    },
    {
        name: "Hikari Otoya",
        images: [""],
        personality: "Soft and Loving",
        gender: "Female",
        mult: 1.2,
    },

];

let secrets = [{
    name: "Meme-Kun",
    images: [""],
    personality: "Lewd.",
    gender: "Male",
    mult: 100,
}, ];

let coms = [{
        Name: "help",
        Description: "Display commands and their functions",
        code: function(message) {
            let out = "This bot is still a work in progress, so please give me and the artist time to add more. Thank you!\n**List of usable commands:**\n";
            for (let i = 0; i < coms.length; i++) {
                out += "**" + coms[i].Name.charAt(0).toUpperCase() + coms[i].Name.slice(1) + "**: " + coms[i].Description + "\n";
            }
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            emb.setDescription(out);
            message.channel.send(emb);
        }
    },
    {
        Name: "coins",
        Description: "Check how many coins you have",
        code: function(message) {
            return message.channel.send(message.member.nickname + ", you have " + coins.getItem(message.author.id) + " coins!");
        }
    },
    {
        Name: "shop",
        Description: "Check the shop!",
        code: function(message) {
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            for (let i = 0; i < items.length; i++) {
                emb.addField(items[i].name, items[i].price + " coins", false);
            }
            return message.channel.send(emb);
        }
    },
    {
        Name: "buy",
        Description: "Buy an item from the shop!",
        code: function(message, args) {
            let wallet = parseInt(coins.getItem(message.author.id));
            let num = -1;
            if (parseInt(args[0]) == args[0]) {
                num = parseInt(args[0]) - 1;
            } else {
                let item = items.filter(items => items.name.toLowerCase() == args[0].toLowerCase());
                if (items.indexOf(item[0]) == -1) return message.channel.send("No item " + args[0] + " found.");
                else num = items.indexOf(item[0]);
            }
            if (num > items.length) return message.channel.send("No item #" + args[0] + "!");
            if (items[num].price > wallet) return message.channel.send(message.member.nickname + ", you don\'t have enough coins for that!");
            wallet -= items[num].price;
            coins.setItem(message.author.id, wallet)
            let out = inv.getItem(message.author.id);
            let arr = out.split("\n");
            let found = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].includes(items[num].name)) {
                    let temp = arr[i].split(":");
                    arr[i] = items[num].name + ":" + (parseInt(temp[1]) + 1);
                    found = true;
                }
            }
            if (!found) {
                out += items[num].name + ":" + "1\n";
            } else out = arr.join("\n");
            inv.setItem(message.author.id, out);
            message.channel.send("Success! You bought " + items[num].name + ", " + message.member.nickname + "!");
        }
    },
    {
        Name: "inv",
        Description: "Display your inventory",
        code: function(message, args) {
            if (inv.getItem(message.author.id).split("\n") < 2) return message.channel.send("You have no items!");
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            let desc = "";
            let str = inv.getItem(message.author.id);
            let arr = str.split("\n");
            for (let i = 0; i < arr.length - 1; i++) {
                let temp = arr[i].split(":");
                desc += temp[0] + " x" + temp[1] + "\n";
            }
            emb.setDescription(desc);
            emb.setTitle(message.member.nickname + "\'s Inventory");
            message.channel.send(emb);
        }
    },
    {
        Name: "daily",
        Description: "Get your daily bonus! Hit 7 days and win a gacha roll!",
        code: function(message) {
            let streak = parseInt(daily.getItem(message.author.id).split(",")[1]) + 1;
            let time = parseInt(daily.getItem(message.author.id).split(",")[0]);
            if ((new Date().getTime() - time) > 86400000) {
                if (streak < 7) {
                    if ((new Date().getTime() - time) > 2 * 86400000)
                        daily.setItem(message.author.id, new Date().getTime() + "," + 0);
                    else
                        daily.setItem(message.author.id, new Date().getTime() + "," + parseInt(streak));
                    coins.setItem(message.author.id, parseInt(parseInt(coins.getItem(message.author.id)) + 5 * streak));
                    return message.channel.send(message.member.nickname + ", you claimed " + 5 * streak + " coins! Your streak is " + streak + " day(s)!");
                } else {
                    daily.setItem(message.author.id, new Date().getTime() + "," + 0);
                    rolls.setItem(message.author.id, parseInt(parseInt(rolls.getItem(message.author.id)) + 1));
                    return message.channel.send("Congrats " + message.member.nickname + "! You won a gacha roll!");
                }
            }
            if (parseInt(((time + 24 * 3.6e+6) - new Date().getTime()) / 3.6e+6) >= 1)
                return message.channel.send(message.member.nickname + ", you can\'t claim daily for " + parseInt(((time + 24 * 3.6e+6) - new Date().getTime()) / 3.6e+6) + " hours!");
            else
                return message.channel.send(message.member.nickname + ", you can\'t claim daily for " + parseInt(((time + 24 * 3.6e+6) - new Date().getTime()) / 60000) + " minutes!");
        }
    },
    {
        Name: "list",
        Description: "List current waifus",
        code: function(message) {
            let out = "";
            let count = 1;
            let wives = mem.getItem(message.author.id).split(",");
            if (wives.length < 2 && secmem.getItem(message.author.id).length < 1 ) return message.channel.send(message.member.nickname + ", you have no Waifus/Husbandos!");
            for (let i = 0; i < wives.length - 1; i++) {
                out += count + ". " + waifus[parseInt(wives[i])].name + ": " + waifus[parseInt(wives[i])].gender + ", Affection level: " + getAffection(message, parseInt(wives[i]), false) + "\n";
                count++;
            }
            if (secmem.getItem(message.author.id).length > 1) {
                let swives = secmem.getItem(message.author.id).split(",");
                for (let i = 0; i < swives.length - 1; i++) {
                    out += count + ". " + secrets[parseInt(swives[i])].name + ": " + secrets[parseInt(swives[i])].gender + ", Affection level: " + getAffection(message, parseInt(swives[i]), true) + "\n";

                    count++;
                }
            }
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            emb.setDescription(out);
            message.channel.send(emb);
        }
    },
    {
        Name: "rolls",
        Description: "Check your rolls",
        code: function(message) {
            message.channel.send(message.member.nickname + ", you have " + rolls.getItem(message.author.id) + " gacha rolls left!");
        }
    },
    {
        Name: "gacha",
        Description: "Roll for a cute new waifu",
        code: function(message) {
            if (parseInt(rolls.getItem(message.author.id)) < 1)
                return message.channel.send(message.member.nickname + ", you don't have any rolls!");
            if (mem.getItem(message.author.id).split(",").length - 1 == waifus.length)
                return message.channel.send(message.member.nickname + ", you have all the current waifus/husbandos!");
            rolls.setItem(message.author.id, parseInt(rolls.getItem(message.author.id) - 1));
            let num = parseInt(Math.random() * waifus.length);
            while (mem.getItem(message.author.id).includes(num))
                num = parseInt(Math.random() * waifus.length);
            mem.setItem(message.author.id, mem.getItem(message.author.id) + num + ",");
            setAffection(message, num, false);
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            emb.setTitle("Your new Waifu/Husbando!");
            emb.setImage(waifus[num].images[0]);
            emb.addField('Name:', waifus[num].name, true);
            emb.addField('Gender:', waifus[num].gender, true);
            emb.addField('Personality:', waifus[num].personality, true);
            message.channel.send(emb);
        }
    },
    {
        Name: "pic",
        Description: "Check out a characters pic!",
        code: function(message, args) {
            if (args[0] < 1 || parseInt(args[0]) != args[0]) return message.channel.send("Choose a waifu number from your list!");
            let ret = findWaifu(message, args)
            if (ret == null) return;
            let w = findWaifu(message, args)[0];
            const emb = new Discord.RichEmbed().setColor('#0099ff');
            emb.setImage(w.images[0]);
            return message.channel.send(emb);
        }
    },
    {
        Name: "talk",
        Description: "Make small talk with your waifu",
        code: function(message, args) {
            if (args[0] < 1 || parseInt(args[0]) != args[0]) return message.channel.send("Choose a waifu number from your list!");
            if (uses.getItem(message.author.id).split(",").length >= 6) return message.channel.send("You\'ve hit your max uses per hour!");
            let ret = findWaifu(message, args);
            if (ret == null) return;
            let w = ret[0];
            let s = ret[1];
            if (!s)
                raiseAffection(message, waifus.indexOf(w), false, 1);
            else
                raiseAffection(message, secrets.indexOf(w), true, 1);
            message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone up by 1!");
            uses.setItem(message.author.id, uses.getItem(message.author.id) + "talk,");
        }
    },
    {
        Name: "bellyrub",
        Description: "Give you waifu a belly rub",
        code: function(message, args) {
            if (args[0] < 1 || parseInt(args[0]) != args[0]) return message.channel.send("Choose a waifu number from your list!");
            if (uses.getItem(message.author.id).split(",").length >= 6) return message.channel.send("You\'ve hit your max uses per hour!");
            let ret = findWaifu(message, args);
            if (ret == null) return;
            let w = ret[0];
            let s = ret[1];
            if(w == secrets[0]){
                message.channel.send(w.name + " seems aroused.");
            } else
            message.channel.send(w.name + " seems confused but satisfied.");
            uses.setItem(message.author.id, uses.getItem(message.author.id) + "bellyrub,");
        }
    },
    {
        Name: "flirt",
        Description: "Flirt with a waifu~",
        code: function(message, args) {
            if (args[0] < 1 || parseInt(args[0]) != args[0]) return message.channel.send("Choose a waifu number from your list!");
            if (uses.getItem(message.author.id).split(",").length >= 6) return message.channel.send("You\'ve hit your max uses per hour!");
            let ret = findWaifu(message, args);
            if (ret == null) return;
            let w = ret[0];
            let s = ret[1];
            let wNum;
            if(s) wNum = secrets.indexOf(w);
            else wNum = waifus.indexOf(w);
            let num = w.mult * Math.random();
            if(parseInt(getAffection(message, wNum, s)) < 5){
                num *= .7;
                if (!s) {
                    if (num > .5) {
                        raiseAffection(message, waifus.indexOf(w), false, 2);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone up by 2!");
                    } else {
                        raiseAffection(message, waifus.indexOf(w), false, -1);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone down by 1!");
                    }
                } else {
                    if (num > .5) {
                        raiseAffection(message, secrets.indexOf(w), true, 2);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone up by 2!");
                    } else {
                        raiseAffection(message, secrets.indexOf(w), true, -1);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone down by 1!");
                    }
                }
                uses.setItem(message.author.id, uses.getItem(message.author.id) + "flirt,");
            } else{
                if (!s) {
                    if (num > .5) {
                        raiseAffection(message, waifus.indexOf(w), false, 2);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone up by 2!");
                    } else {
                        raiseAffection(message, waifus.indexOf(w), false, -1);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone down by 1!");
                    }
                } else {
                    if (num > .5) {
                        raiseAffection(message, secrets.indexOf(w), true, 2);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone up by 2!");
                    } else {
                        raiseAffection(message, secrets.indexOf(w), true, -1);
                        message.channel.send(message.member.nickname + ", your affection level with " + w.name + " has gone down by 1!");
                    }
                }
                uses.setItem(message.author.id, uses.getItem(message.author.id) + "flirt,");
            }
        }
    },
];

function process(command, message, args) {
    if (coms.filter(coms => coms.Name === command).length > 0) {
        let funct = coms.filter(coms => coms.Name === command);
        funct[0].code(message, args);
    }
}

client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'welcome');

  if (!channel) return;

  channel.send(`Welcome to the dark army, ${member}. We will bribe you to stay with love, try to get yourself a waifu or husbando in the bot channel, try w.help`);
});

client.on("message", async message => {
    if (message.author.bot) return;
    storageCheck(message);
    if ((message.content.indexOf(auth.prefix) !== 0) && (message.content.indexOf(auth.Prefix) !== 0)) return;
    const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    process(command, message, args);

});



var auth = require('./auth.json');
client.login(auth.token);

function setAffection(message, waifuNum, secret) {
    let inp = affection.getItem(message.author.id);
    let out = "";
    if (secret)
        out = "s" + waifuNum + ":" + 0 + "\n" + inp;
    else
        out = waifuNum + ":" + 0 + "\n" + inp;

    affection.setItem(message.author.id, out);
}

function getAffection(message, waifuNum, secret) {
    let inp = affection.getItem(message.author.id);
    let arr = inp.split("\n");
    for (let i = 0; i < arr.length; i++) {
        let arg = arr[i].split(":");
        if (!secret) {
            if (arg[0] == waifuNum)
                return arg[1];
        } else
        if (arg[0] == "s" + waifuNum) {
            return arg[1];
        }
    }
}

function raiseAffection(message, waifuNum, secret, amt) {
    let arr = affection.getItem(message.author.id).split("\n");
    let del = false;
    let ind = -1;
    for (let i = 0; i < arr.length - 1; i++) {
        let arg = arr[i].split(":");
        if (!secret) {
            if (arg[0] == waifuNum){
                arg[1] = parseInt(parseInt(arg[1]) + amt);
                if (parseInt(parseInt(arg[1]) + amt) < 0){
                 del = true;
                 ind = i;
                 }
            }
        } else {
            if (arg[0] == "s" + waifuNum){
                arg[1] = parseInt(parseInt(arg[1]) + amt);
                if (parseInt(parseInt(arg[1]) + amt) < 0){
                 del = true;
                 ind = i;
                 }
            }
        }
        arr[i] = arg.join(":");
    }
    if(del){ 
        arr.splice(ind, 1);
    }
    affection.setItem(message.author.id, arr.join("\n"));
    if(del){
        message.channel.send("Your waifu ran away!");
        let stay = [];
        if(!secret){
            stay = mem.getItem(message.author.id).split(",");
            }
        else {
            stay = secmem.getItem(message.author.id).split(",");
            }
        if(!secret){
            if(mem.getItem(message.author.id).substring(0,2) == waifuNum + ",") 
                 mem.setItem(message.author.id, mem.getItem(message.author.id).substring(2));
            else
                mem.setItem(message.author.id, mem.getItem(message.author.id).replace("," + waifuNum + ",", ","));
            }
        else {
            if(secmem.getItem(message.author.id).substring(0,2) == waifuNum + ",") 
                 secmem.setItem(message.author.id, secmem.getItem(message.author.id).substring(2));
            else
                secmem.setItem(message.author.id, secmem.getItem(message.author.id).replace("," + waifuNum + ",", ","));
            }
    }
}

function findWaifu(message, args) {
    let wives = mem.getItem(message.author.id).split(",");
    let arr = [""];
    let secret = false;
    count = 0;
    for (let i = 0; i < wives.length - 1; i++) {
        arr[count] = wives[i];
        count++
    }
    let swives = "";
    if (secmem.getItem(message.author.id).length > 1) {
        swives = secmem.getItem(message.author.id).split(",");
        for (let i = 0; i < swives.length - 1; i++) {
            arr[count] = swives[i];
            count++
        }
    }
    if (parseInt(args[0]) > count) {
        message.channel.send(message.member.nickname + ", you don\'t have this waifu!");
        return null;
    }
    let w;
    if (args[0] >= wives.length) {
        w = swives[parseInt(args[0]) - wives.length];
        w = secrets[parseInt(w)];
        secret = true;
    } else {
        w = wives[parseInt(args[0]) - 1]
        w = waifus[w];
    }
    return [w, secret];
}

function init() {
    if (typeof mem === "undefined" || mem === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        mem = new LocalStorage('./storage/mem');
    }

    if (typeof rolls === "undefined" || rolls === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        rolls = new LocalStorage('./storage/rolls');
    }

    if (typeof daily === "undefined" || daily === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        daily = new LocalStorage('./storage/daily');
    }

    if (typeof coins === "undefined" || coins === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        coins = new LocalStorage('./storage/coins');
    }

    if (typeof inv === "undefined" || inv === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        inv = new LocalStorage('./storage/inv');
    }

    if (typeof secmem === "undefined" || secmem === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        secmem = new LocalStorage('./storage/secmem');
    }

    if (typeof affection === "undefined" || affection === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        affection = new LocalStorage('./storage/affection');
    }

    if (typeof uses === "undefined" || uses === null) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        uses = new LocalStorage('./storage/uses');
    }
}

function storageCheck(message) {
    if (rolls.getItem(message.author.id) == null) {
        rolls.setItem(message.author.id, 1);
    }
    if (mem.getItem(message.author.id) == null) {
        mem.setItem(message.author.id, "");
    }
    if (secmem.getItem(message.author.id) == null) {
        secmem.setItem(message.author.id, "");
    }
    if (daily.getItem(message.author.id) == null) {
        daily.setItem(message.author.id, 0 + "," + 0);
    }
    if (coins.getItem(message.author.id) == null) {
        coins.setItem(message.author.id, 0);
    }
    if (inv.getItem(message.author.id) == null) {
        inv.setItem(message.author.id, "");
    }
    if (affection.getItem(message.author.id) == null) {
        affection.setItem(message.author.id, "");
    }
    if (uses.getItem(message.author.id) == null) {
        uses.setItem(message.author.id, "");
    }

    if ((new Date().getTime() - parseInt(uses.getItem("time"))) > 3.6e+6) {
        uses.clear();
        uses.setItem("time", new Date().getTime());
        uses.setItem(message.author.id, "");
    }
}
