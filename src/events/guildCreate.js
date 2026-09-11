const {
    Events,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

/*
=========================
    ENCONTRA O MELHOR CANAL
=========================
*/

function encontrarCanalDeAnuncio(guild, botMember) {

    const permissoesNecessarias = [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.EmbedLinks
    ];

    const podeUsar = (channel) => {

        if (channel.type !== ChannelType.GuildText) return false;

        const permissoes = channel.permissionsFor(botMember);

        return !!permissoes && permissoes.has(permissoesNecessarias);

    };

    // Prioridade 1: canal de sistema do servidor (onde o Discord manda "fulano entrou")
    if (guild.systemChannel && podeUsar(guild.systemChannel)) {

        return guild.systemChannel;

    }

    // Prioridade 2: primeiro canal de texto disponível, na ordem de posição do servidor
    const primeiroDisponivel = guild.channels.cache

        .filter(podeUsar)

        .sort((a, b) => a.rawPosition - b.rawPosition)

        .first();

    return primeiroDisponivel || null;

}

/*
=========================
    EMBED DE APRESENTAÇÃO
=========================
*/

function buildEmbedApresentacao(guild) {

    return new EmbedBuilder()

        .setColor("#5865F2")

        .setAuthor({
            name: "JarvisCore",
            iconURL: guild.client.user.displayAvatarURL()
        })

        .setTitle(`👋 Olá, ${guild.name}!`)

        .setDescription(
            "Obrigado por me adicionar! Eu sou o **JarvisCore**, um assistente inteligente para Discord " +
            "criado por **<JeffinPVP/>**.\n\n" +
            "Converse comigo mencionando `@JarvisCore` em qualquer canal ou explore meus recursos:"
        )

        .addFields(

            {
                name: "🛡️ Moderação",
                value: "Ban, kick, timeout, avisos, canais trancados e muito mais.",
                inline: true
            },

            {
                name: "🎭 Cargos automáticos",
                value: "Auto-role de entrada, self-role e cargos por nível.",
                inline: true
            },

            {
                name: "🎫 Tickets",
                value: "Sistema completo de atendimento por tickets.",
                inline: true
            },

            {
                name: "💰 Economia",
                value: "Moedas, trabalho, diária, apostas e ranking.",
                inline: true
            },

            {
                name: "📜 Logs",
                value: "Registro de tudo que acontece no servidor.",
                inline: true
            },

            {
                name: "🏗️ Criar Servidor com IA",
                value: "Use `/criar-servidor` para gerar uma estrutura completa do zero.",
                inline: true
            }

        )

        .addFields({
            name: "⚙️ Primeiros passos",
            value: "Use `/config status` para ver e ajustar minhas configurações neste servidor."
        })

        .addFields({
            name: "💬 Meu servidor de suporte",
            value: "Entre no meu servidor de suporte com esse link: `https://discord.gg/Kk4AbujYTF`."
        })

        .setThumbnail(guild.client.user.displayAvatarURL())

        .setFooter({ text: "JarvisCore • Desenvolvido por JeffinPVP" })

        .setTimestamp();

}

module.exports = {

    name: Events.GuildCreate,

    async execute(guild) {

        console.log(`✔ Entrei em um novo servidor: ${guild.name} (${guild.id})`);

        try {

            const botMember = guild.members.me || await guild.members.fetchMe();
            const canal = encontrarCanalDeAnuncio(guild, botMember);

            if (!canal) {

                console.log(`⚠️ Nenhum canal disponível para anunciar a chegada em "${guild.name}".`);
                return;

            }

            await canal.send({ embeds: [buildEmbedApresentacao(guild)] });

        } catch (error) {

            console.error(`❌ Falha ao enviar mensagem de boas-vindas em "${guild.name}":`, error);

        }

    }

};
