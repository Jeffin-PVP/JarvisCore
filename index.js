require("dotenv").config();

const fs = require("fs");
const path = require("path");

const ApiServer =
    require("./src/api/server");

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    Events
} = require("discord.js");

const commands =
    require("./src/commands");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent,

        GatewayIntentBits.GuildVoiceStates

    ],

    partials: [

        Partials.Channel,

        Partials.Message,

        Partials.User

    ]

});


// ===============================
// COMMANDS
// ===============================

client.commands = new Collection();

for (const command of Object.values(commands)) {

    client.commands.set(

        command.data.name,

        command

    );

}


// ===============================
// EVENTS
// ===============================

const eventsPath = path.join(

    __dirname,

    "src",

    "events"

);

if (fs.existsSync(eventsPath)) {

    const eventFiles = fs.readdirSync(eventsPath)

        .filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {

        const event = require(

            path.join(

                eventsPath,

                file

            )

        );

        client.on(

            event.name,

            (...args) => event.execute(...args)

        );

        console.log(
            `✔ Evento carregado: ${event.name}`
        );

    }

}


// ===============================
// READY
// ===============================

client.once(

    Events.ClientReady,

    () => {

        console.clear();

        console.log(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        console.log(
            "🤖 JarvisCore"
        );

        console.log(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

        console.log(
            `👤 Logado como: ${client.user.tag}`
        );

        const api =
            new ApiServer(client);


        api.start(process.env.PORT || 3000);

        console.log(
            `🆔 ID: ${client.user.id}`
        );

        console.log(
            `🌍 Servidores: ${client.guilds.cache.size}`
        );

        console.log(
            `📶 Ping: ${client.ws.ping}ms`
        );

        console.log(
            "🟢 IA: Conectada"
        );

        console.log(
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        );

    }

);

client.login(
    process.env.TOKEN
);