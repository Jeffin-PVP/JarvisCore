const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const GiveawayRepository = require("../../database/repositories/GiveawayRepository");
const GiveawayManager = require("../../managers/GiveawayManager");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("sorteio")

        .setDescription("Sistema de sorteios do servidor.")

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addSubcommand(sub =>

            sub
                .setName("criar")
                .setDescription("Cria um novo sorteio.")
                .addStringOption(o => o.setName("premio").setDescription("O que vai ser sorteado.").setRequired(true))
                .addStringOption(o => o.setName("duracao").setDescription("Duração (ex: 10m, 2h, 1d, 1d12h).").setRequired(true))
                .addIntegerOption(o => o.setName("vencedores").setDescription("Quantidade de vencedores (padrão: 1).").setMinValue(1).setMaxValue(20).setRequired(false))
                .addChannelOption(o => o.setName("canal").setDescription("Canal onde o sorteio será postado (padrão: canal atual).").addChannelTypes(ChannelType.GuildText).setRequired(false))
                .addRoleOption(o => o.setName("cargo").setDescription("Cargo necessário para participar (opcional).").setRequired(false))

        )

        .addSubcommand(sub =>

            sub
                .setName("cancelar")
                .setDescription("Cancela um sorteio em andamento.")
                .addIntegerOption(o => o.setName("id").setDescription("ID do sorteio (veja em /sorteio listar).").setRequired(true))

        )

        .addSubcommand(sub =>

            sub
                .setName("reroll")
                .setDescription("Sorteia novo(s) vencedor(es) de um sorteio já encerrado.")
                .addIntegerOption(o => o.setName("id").setDescription("ID do sorteio (veja em /sorteio listar).").setRequired(true))
                .addIntegerOption(o => o.setName("vencedores").setDescription("Quantidade de novos vencedores (padrão: o mesmo do sorteio).").setMinValue(1).setMaxValue(20).setRequired(false))

        )

        .addSubcommand(sub =>

            sub
                .setName("listar")
                .setDescription("Lista os sorteios em andamento neste servidor.")

        ),

    async execute(interaction) {

        const sub = interaction.options.getSubcommand();
        const { guild } = interaction;

        /*
        =========================
            CRIAR
        =========================
        */

        if (sub === "criar") {

            const premio = interaction.options.getString("premio");
            const duracaoTexto = interaction.options.getString("duracao");
            const vencedores = interaction.options.getInteger("vencedores") || 1;
            const canal = interaction.options.getChannel("canal") || interaction.channel;
            const cargo = interaction.options.getRole("cargo");

            const duracaoMs = GiveawayManager.parseDuracao(duracaoTexto);

            if (!duracaoMs || duracaoMs < 10 * 1000) {

                return interaction.reply({
                    content: "⚠️ Duração inválida. Use algo como `10m`, `2h`, `1d` ou `1d12h` (mínimo de 10 segundos).",
                    ephemeral: true
                });

            }

            const botMember = await guild.members.fetchMe();
            const permissoesCanal = canal.permissionsFor(botMember);

            if (!permissoesCanal || !permissoesCanal.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks])) {

                return interaction.reply({
                    content: `⚠️ Não tenho permissão para enviar mensagens/embeds em ${canal}.`,
                    ephemeral: true
                });

            }

            const endsAt = Date.now() + duracaoMs;

            const giveawayId = await GiveawayRepository.create({
                guildId: guild.id,
                channelId: canal.id,
                hostId: interaction.user.id,
                prize: premio,
                winnersCount: vencedores,
                requiredRoleId: cargo?.id || null,
                endsAt
            });

            const giveaway = await GiveawayRepository.get(giveawayId);

            const embed = GiveawayManager.buildEmbedAtivo(giveaway, 0);
            const row = GiveawayManager.buildBotaoParticipar(giveawayId);

            const mensagem = await canal.send({
                content: "🎉 **SORTEIO** 🎉",
                embeds: [embed],
                components: [row]
            });

            await GiveawayRepository.setMessageId(giveawayId, mensagem.id);

            return interaction.reply({
                content: `✅ Sorteio de **${premio}** criado em ${canal}! Termina em **${GiveawayManager.formatarDuracao(duracaoMs)}**. (ID: \`${giveawayId}\`)`,
                ephemeral: true
            });

        }

        /*
        =========================
            CANCELAR
        =========================
        */

        if (sub === "cancelar") {

            const id = interaction.options.getInteger("id");
            const giveaway = await GiveawayRepository.get(id);

            if (!giveaway || giveaway.guild_id !== guild.id) {

                return interaction.reply({
                    content: "⚠️ Sorteio não encontrado neste servidor.",
                    ephemeral: true
                });

            }

            if (giveaway.status !== "running") {

                return interaction.reply({
                    content: "⚠️ Esse sorteio já não está mais em andamento.",
                    ephemeral: true
                });

            }

            await GiveawayRepository.setStatus(id, "cancelled");

            try {

                const canal = await guild.channels.fetch(giveaway.channel_id);

                if (giveaway.message_id) {

                    const mensagem = await canal.messages.fetch(giveaway.message_id);

                    const embedCancelado = new EmbedBuilder()
                        .setColor("#ED4245")
                        .setTitle("🎉 SORTEIO CANCELADO 🎉")
                        .setDescription(`🎁 **Prêmio:** ${giveaway.prize}\n\nEste sorteio foi cancelado por um administrador.`)
                        .setFooter({ text: `ID do sorteio: ${giveaway.id}` });

                    await mensagem.edit({
                        embeds: [embedCancelado],
                        components: [GiveawayManager.buildBotaoParticipar(giveaway.id, true)]
                    });

                }

            } catch {
                // canal/mensagem pode não existir mais, tudo bem
            }

            return interaction.reply({
                content: `✅ Sorteio \`${id}\` cancelado.`,
                ephemeral: true
            });

        }

        /*
        =========================
            REROLL
        =========================
        */

        if (sub === "reroll") {

            const id = interaction.options.getInteger("id");
            const vencedores = interaction.options.getInteger("vencedores");

            const giveaway = await GiveawayRepository.get(id);

            if (!giveaway || giveaway.guild_id !== guild.id) {

                return interaction.reply({
                    content: "⚠️ Sorteio não encontrado neste servidor.",
                    ephemeral: true
                });

            }

            const resultado = await GiveawayManager.rerollSorteio(interaction.client, id, vencedores);

            if (!resultado.sucesso) {

                return interaction.reply({
                    content: `⚠️ ${resultado.motivo}`,
                    ephemeral: true
                });

            }

            return interaction.reply({
                content: `✅ Novo(s) vencedor(es) sorteado(s): ${resultado.vencedores.map(uid => `<@${uid}>`).join(", ")}`,
                ephemeral: true
            });

        }

        /*
        =========================
            LISTAR
        =========================
        */

        if (sub === "listar") {

            const sorteios = await GiveawayRepository.listRunningByGuild(guild.id);

            if (!sorteios.length) {

                return interaction.reply({
                    content: "📭 Nenhum sorteio em andamento neste servidor.",
                    ephemeral: true
                });

            }

            const descricao = sorteios.map(g => {

                const fimSegundos = Math.floor(g.ends_at / 1000);

                return `**ID \`${g.id}\`** — ${g.prize} em <#${g.channel_id}> • termina <t:${fimSegundos}:R>`;

            }).join("\n");

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🎉 Sorteios em andamento")
                .setDescription(descricao);

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        }

    }

};
