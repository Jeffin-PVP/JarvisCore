const Tool = require("../../structures/Tool");

module.exports = new class extends Tool {

    constructor() {

        super({

            name: "getStickers",

            description: "Lista todas as figurinhas do servidor.",

            category: "Server"

        });

    }

    async execute(message) {

        return message.guild.stickers.cache.map(sticker => ({

            id: sticker.id,

            name: sticker.name,

            description: sticker.description,

            tags: sticker.tags

        }));

    }

};