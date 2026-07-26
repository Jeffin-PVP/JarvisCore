const Tool = require("../../structures/Tool");

module.exports = new class extends Tool {

    constructor() {

        super({

            name: "getServerInfo",

            description: "Obtém todas as informações do servidor.",

            category: "Server"

        });

    }

    async execute(message) {

        const guild = message.guild;

        await guild.fetch();

        const owner = await guild.fetchOwner();

        return {

            id: guild.id,

            name: guild.name,

            description: guild.description,

            owner: {

                id: owner.id,

                username: owner.user.username,

                displayName: owner.displayName

            },

            memberCount: guild.memberCount,

            createdAt: guild.createdAt,

            preferredLocale: guild.preferredLocale,

            verificationLevel: guild.verificationLevel,

            boostLevel: guild.premiumTier,

            boosts: guild.premiumSubscriptionCount,

            afkTimeout: guild.afkTimeout,

            afkChannel: guild.afkChannel?.name ?? null,

            systemChannel: guild.systemChannel?.name ?? null,

            rulesChannel: guild.rulesChannel?.name ?? null,

            publicUpdatesChannel: guild.publicUpdatesChannel?.name ?? null,

            icon: guild.iconURL(),

            banner: guild.bannerURL()

        };

    }

};