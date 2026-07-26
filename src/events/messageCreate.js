const AIManager = require("../ai/AIManager");
const ContextProvider = require("../ai/ContextProvider");

module.exports = {

    name: "messageCreate",

    async execute(message) {

        if (message.author.bot) return;

        if (!message.guild) return;

        if (message.mentions.everyone) return;

        if (!message.mentions.has(message.client.user)) return;

        const question = message.content
            .replace(`<@${message.client.user.id}>`, "")
            .replace(`<@!${message.client.user.id}>`, "")
            .trim();

        if (!question) {

            return message.reply(
                "👋 Olá! Como posso ajudar?"
            );

        }

        try {

            await message.channel.sendTyping();

            const context = await ContextProvider.build(message);

            const response = await AIManager.chat({

                message,
                question,
                context

            });

            await message.reply(response);

        } catch (err) {

            console.error(err);

            await message.reply(
                "❌ Ocorreu um erro ao conversar com a IA."
            );

        }

    }

};