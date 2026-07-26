const Tool = require("../../structures/Tool");

module.exports = new class extends Tool {

    constructor() {

        super({

            name: "getRules",

            description: "Obtém os canais relacionados às regras e sistema do servidor.",

            category: "Server"

        });

    }

    async execute(message) {

        const guild = message.guild;

        return {

            rulesChannel: guild.rulesChannel
                ? {
                    id: guild.rulesChannel.id,
                    name: guild.rulesChannel.name
                }
                : null,

            systemChannel: guild.systemChannel
                ? {
                    id: guild.systemChannel.id,
                    name: guild.systemChannel.name
                }
                : null,

            publicUpdatesChannel: guild.publicUpdatesChannel
                ? {
                    id: guild.publicUpdatesChannel.id,
                    name: guild.publicUpdatesChannel.name
                }
                : null

        };

    }

};