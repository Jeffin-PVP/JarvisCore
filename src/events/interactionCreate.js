const {
    Events
} = require("discord.js");

const CommandManager =
    require("../managers/CommandManager");

const modalSubmit =
    require("../interactions/modalSubmit");

const embedButtons =
    require("../interactions/embed/buttonHandler");

const embedModals =
    require("../interactions/embed/modalHandler");

const embedChannel =
    require("../interactions/embed/channelHandler");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        try {

            /*
            =========================
                MODAIS
            =========================
            */

            if (interaction.isModalSubmit()) {

                if (interaction.customId.startsWith("embed_")) {

                    return embedModals.execute(interaction);

                }

                return modalSubmit.execute(interaction);

            }

            /*
            =========================
                BOTÕES
            =========================
            */

            if (interaction.isButton()) {

                return embedButtons.execute(interaction);

            }

            /*
            =========================
                SELECT MENU
            =========================
            */

            if (interaction.isChannelSelectMenu()) {

                return embedChannel.execute(interaction);

            }

            /*
            =========================
                COMANDOS
            =========================
            */

            if (!interaction.isChatInputCommand())
                return;

            return CommandManager.execute(interaction);

        } catch (error) {

            console.error("Erro na interação:", error);

            try {

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({

                        content: "❌ Ocorreu um erro ao processar a interação.",

                        ephemeral: true

                    });

                } else {

                    await interaction.reply({

                        content: "❌ Ocorreu um erro ao processar a interação.",

                        ephemeral: true

                    });

                }

            } catch { }

        }

    }

};