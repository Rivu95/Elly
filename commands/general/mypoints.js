const Discord = require("discord.js");
const DB = require("../../Database/heyCounterData");

module.exports = {
    name: "mypoints",
    description: "leader Board of Hey guy Count",
    aliases: ["my", "profile"],
    usage: " ",
    guildOnly: true,
};

module.exports.run = async (client, message, args) => {

    //collecting Data from DB
    const user_data = await DB.getUser(message.author.id);

    if (!user_data) return message.reply("You didn't even sent a single hay guys! Lul");

    const embed = new Discord.MessageEmbed()
        .setColor("#b00b69")
        .setTitle(`Hey Guys Data of ${message.author.username}#${message.author.discriminator}`)
        .setDescription(`Total heys: \`${user_data.total}\`\nCurrent Streak: \`${user_data.count}\`\nError: \`${user_data.error}\``)

    return message.channel.send(embed);
}