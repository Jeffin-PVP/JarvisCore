const {
    Events
} = require("discord.js");

const CommandManager =
    require("../managers/CommandManager");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        try {

            await CommandManager.execute(
                interaction
            );

        } catch (error) {

            console.error(
                `Erro no comando ${interaction.commandName}:`,
                error
            );

            const payload = {

                content:
                    "❌ Ocorreu um erro ao executar o comando.",

                ephemeral: true

            };

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp(payload)
                    .catch(() => {});

            } else {

                await interaction.reply(payload)
                    .catch(() => {});

            }

        }

    }

};