const GiveawayRepository = require("../../database/repositories/GiveawayRepository");
const GiveawayManager = require("../../managers/GiveawayManager");

module.exports = {

    async execute(interaction) {

        const giveawayId = Number(interaction.customId.split("_")[2]);

        const giveaway = await GiveawayRepository.get(giveawayId);

        if (!giveaway || giveaway.status !== "running") {

            return interaction.reply({
                content: "⚠️ Esse sorteio não está mais ativo.",
                ephemeral: true
            });

        }

        if (giveaway.required_role_id && !interaction.member.roles.cache.has(giveaway.required_role_id)) {

            return interaction.reply({
                content: `⚠️ Você precisa do cargo <@&${giveaway.required_role_id}> para participar deste sorteio.`,
                ephemeral: true
            });

        }

        const jaParticipa = await GiveawayRepository.hasEntry(giveawayId, interaction.user.id);

        if (jaParticipa) {

            await GiveawayRepository.removeEntry(giveawayId, interaction.user.id);

            await interaction.reply({
                content: "❌ Você saiu do sorteio.",
                ephemeral: true
            });

        } else {

            await GiveawayRepository.addEntry(giveawayId, interaction.user.id);

            await interaction.reply({
                content: "🎉 Você entrou no sorteio! Boa sorte!",
                ephemeral: true
            });

        }

        const totalParticipantes = await GiveawayRepository.countEntries(giveawayId);
        const embedAtualizado = GiveawayManager.buildEmbedAtivo(giveaway, totalParticipantes);

        await interaction.message.edit({ embeds: [embedAtualizado] }).catch(() => {});

    }

};
