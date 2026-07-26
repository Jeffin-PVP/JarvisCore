const {
    EmbedBuilder
} = require("discord.js");

const LogTypes = require("../LogTypes");
const LogColors = require("../LogColors");
const LogIcons = require("../LogIcons");

class LogBuilder {

    static create(data) {

        const targetTag =
            data.target?.user?.tag ??
            data.target?.tag ??
            data.target?.username ??
            "Desconhecido";

        const executorTag =
            data.executor?.user?.tag ??
            data.executor?.tag ??
            data.executor?.username ??
            "Desconhecido";


        const embed = new EmbedBuilder()
            .setTimestamp();

        switch (data.type) {

            // ==========================
            // BAN
            // ==========================

            case LogTypes.BAN:

                embed
                    .setColor(LogColors.BAN)
                    .setTitle(`${LogIcons.BAN} Membro Banido`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: `${targetTag}\n\`${data.target.id}\``
                        },
                        {
                            name: "🛡️ Moderador",
                            value: `${executorTag}`
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason || "Nenhum."
                        }
                    );

                break;

            // ==========================
            // DESBANIMENTO
            // ==========================

            case LogTypes.UNBAN_MEMBER:

                embed
                    .setColor(LogColors.UNBAN)
                    .setTitle(`${LogIcons.UNBAN} Membro Desbanido`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: `${targetTag}\n\`${data.target.id}\``
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason || "Nenhum."
                        }
                    );

                break;

            // ==========================
            // KICK
            // ==========================

            case LogTypes.KICK:

                embed
                    .setColor(LogColors.KICK)
                    .setTitle(`${LogIcons.KICK} Membro Expulso`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: `${targetTag}\n\`${data.target.id}\``
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason || "Nenhum."
                        }
                    );

                break;

            // ==========================
            // WARN
            // ==========================

            case LogTypes.WARN:

                embed
                    .setColor(LogColors.WARN)
                    .setTitle(`${LogIcons.WARN} Advertência`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: `${targetTag}\n\`${data.target.id}\``
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            // ==========================
            // TIMEOUT
            // ==========================

            case LogTypes.TIMEOUT:

                embed
                    .setColor(LogColors.TIMEOUT)
                    .setTitle(`${LogIcons.TIMEOUT} Timeout`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: `${targetTag}`
                        },
                        {
                            name: "⏳ Duração",
                            value: data.duration
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            // ==========================
            // REMOVER TIMEOUT
            // ==========================

            case LogTypes.REMOVE_TIMEOUT:

                embed
                    .setColor(LogColors.REMOVE_TIMEOUT)
                    .setTitle(`${LogIcons.REMOVE_TIMEOUT} Timeout Removido`)
                    .addFields(
                        {
                            name: "👤 Usuário",
                            value: targetTag
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            // ==========================
            // LIMPEZA
            // ==========================

            case LogTypes.PURGE_MESSAGES:

                embed
                    .setColor(LogColors.PURGE)
                    .setTitle(`${LogIcons.PURGE} Limpeza de Mensagens`)
                    .addFields(
                        {
                            name: "📺 Canal",
                            value: `${data.channel.name}`
                        },
                        {
                            name: "🧹 Mensagens",
                            value: `${data.amount}`
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        }
                    );

                break;

            // ==========================
            // LOCK
            // ==========================

            case LogTypes.LOCK_CHANNEL:

                embed
                    .setColor(LogColors.LOCK)
                    .setTitle(`${LogIcons.LOCK} Canal Bloqueado`)
                    .addFields(
                        {
                            name: "📺 Canal",
                            value: `${data.channel.name}`
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            // ==========================
            // UNLOCK
            // ==========================

            case LogTypes.UNLOCK_CHANNEL:

                embed
                    .setColor(LogColors.UNLOCK)
                    .setTitle(`${LogIcons.UNLOCK} Canal Desbloqueado`)
                    .addFields(
                        {
                            name: "📺 Canal",
                            value: `${data.channel.name}`
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            // ==========================
            // SLOWMODE
            // ==========================

            case LogTypes.SLOWMODE_CHANNEL:

                embed
                    .setColor(LogColors.SLOWMODE)
                    .setTitle(`${LogIcons.SLOWMODE} Slowmode Alterado`)
                    .addFields(
                        {
                            name: "📺 Canal",
                            value: `${data.channel.name}`
                        },
                        {
                            name: "⏱️ Novo tempo",
                            value: `${data.extra.seconds} segundos`
                        },
                        {
                            name: "🛡️ Moderador",
                            value: executorTag
                        },
                        {
                            name: "📝 Motivo",
                            value: data.reason
                        }
                    );

                break;

            default:

                return null;

        }

        return embed;

    }

}

module.exports = LogBuilder;