
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const fs = require("fs");
require('dotenv').config();

const client = new Client({ ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] } });

client.once('ready', () => {
	console.log('Elly is ready');
	client.user.setActivity("You Spam[-]", { type: "WATCHING" });
});


//------------------------------- Event Handler -------------------------------//
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const eventFunction = require(`./events/${file}`);
		if (eventFunction.disabled) return;

		const event = eventFunction.event || file.split(".")[0];
		const emitter =
			(typeof eventFunction.emitter === "string"
				? client[eventFunction.emitter]
				: eventFunction.emitter) || client;
		const once = eventFunction.once;

		try {
			emitter[once ? "once" : "on"](event, (...args) =>
				eventFunction.run(client, ...args)
			);
		} catch (error) {
			console.error(error.stack);
		}
	});
})

//------------------------------- Command Handler -------------------------------//
client.commands = new Discord.Collection();
let commandFolders = fs
	.readdirSync("./commands");

for (const folder of commandFolders) {
	let commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter(file => file.endsWith(".js"));

	for (const file of commandFiles) {
		let command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

//------------------------------- Error Logging -------------------------------//
process.on("unhandledRejection", error => {
	console.error("Unhandled promise rejection:", error);
});

//------------------------------- Logging In -------------------------------//
client.login(process.env.DISCORD_TOKEN);