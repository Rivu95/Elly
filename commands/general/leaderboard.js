const Discord = require("discord.js");
const DB = require("../../Database/heyCounterData");

module.exports = {
    name: "leaderboard",
    description: "leader Board of Hey guy Count",
    aliases: ["lb"],
    usage: " ",
    guildOnly: true,
};

module.exports.run = async (client, message, args) => {

    //collecting Data from DB
    const top = await DB.getAllUser();

    let desc = `\`#   PTS   ERR   NAME          \`\n`;
    let index = 1;
    for (const data of top) {
        let member = message.guild.members.cache.get(data.discord_id);
        if (member) {
            desc += `\`${index.toString().padEnd(3, " ")}\`  \`${data.total.toString().padEnd(5, " ")}\`  \`${data.error.toString().padEnd(5, " ")}\`  \`${member.user.tag.padEnd(16," ")}\`\n`;
            index++;
        }
    }

    //embed creation
    const embed = new Discord.MessageEmbed()
        .setColor("#b00b69")
        .setTitle("Hey Guys Leader Board! POG")
        .setDescription(desc)
        .setTimestamp()

    return message.channel.send(embed);
}