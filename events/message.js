const Discord = require("discord.js");
require('dotenv').config();
const DB = require("../Database/heyCounterData");

module.exports.run = async (client, message) => {
    if (message.author.bot) return;

    let prefix = process.env.PREFIX;

    if (message.mentions.has(process.env.BOT_ID) && !message.content.includes("@everyone")) {
        if (!message.content.includes("@here")) {
            message.reply("My prefix is `" + prefix + "`");
        }
    }

    //******************************** HEY COUNTING HERE *******************************//

    if (message.channel.id === process.env.HEY_CHANNEL) {
        if (message.content.indexOf("<:HeyGuys:827310990370275338>") === 0) {
            await DB.addUser(message.author.id);
            await DB.updateUserPoints(message.author.id);
        } else {
            await DB.addUser(message.author.id);
            await DB.updateUserErrors(message.author.id);
            let member = message.guild.members.cache.get(message.author.id);
            member.roles.add(message.guild.roles.cache.get(process.env.BYE_GUYS_ROLE));
            return message.reply(`Only <:HeyGuys:827310990370275338> baka!`);
        }
    }
    //******************************** HEY COUNTING END *******************************//

    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

    if (!cmd) return;

    if (cmd.guildOnly && message.channel.type !== "text") {
        return message.reply("I can't execute that command inside DMs!");
    }

    if (cmd.args && args.length === 0) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (cmd.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${cmd.name} ${cmd.usage}\``;
        }
        return message.channel.send(reply);
    }

    if (cmd.perms && !message.member.hasPermission(cmd.perms)) {
        return message.reply(`you don't have ${cmd.perms} permission to execute this command. Sorry! `);
    }

    try {
        client.commands.get(cmd.name).run(client, message, args);
    } catch (error) {
        message.reply(`There was an error trying to execute ${cmd.name} command!`);
    }
};
