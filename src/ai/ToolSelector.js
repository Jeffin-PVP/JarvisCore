const fullSchema = require("../tools/schema");

class ToolSelector {

    static rules = {

        members: [

            {
                keywords: [
                    "quem é",
                    "quem e",
                    "perfil",
                    "informações",
                    "informacoes",
                    "dados"
                ],
                tools: [
                    "searchMember",
                    "getMember"
                ]
            },

            {
                keywords: [
                    "cargo",
                    "cargos"
                ],
                tools: [
                    "searchMember",
                    "getMemberRoles",
                    "getRoles"
                ]
            },

            {
                keywords: [
                    "permissão",
                    "permissões",
                    "permissao",
                    "permissoes"
                ],
                tools: [
                    "searchMember",
                    "getMemberPermissions"
                ]
            },

            {
                keywords: [
                    "status",
                    "online",
                    "offline",
                    "ausente",
                    "ocupado"
                ],
                tools: [
                    "searchMember",
                    "getMemberStatus",
                    "getOnlineMembers"
                ]
            }

        ],

        moderation: [

            {
                keywords: [
                    "ban",
                    "banir",
                    "banimento"
                ],
                tools: [
                    "searchMember",
                    "banMember"
                ]
            },

            {
                keywords: [
                    "kick",
                    "expuls",
                    "expulse"
                ],
                tools: [
                    "searchMember",
                    "kickMember"
                ]
            },

            {
                keywords: [
                    "mute",
                    "mutar",
                    "silenciar",
                    "timeout"
                ],
                tools: [
                    "searchMember",
                    "timeoutMember"
                ]
            },

            {
                keywords: [
                    "desmut",
                    "unmute",
                    "remover timeout",
                    "tirar timeout"
                ],
                tools: [
                    "searchMember",
                    "removeTimeout"
                ]
            },

            {
                keywords: [
                    "advert",
                    "warn",
                    "aviso"
                ],
                tools: [
                    "searchMember",
                    "warnMember"
                ]
            },

            {
                keywords: [
                    "avisos",
                    "advertências",
                    "advertencias"
                ],
                tools: [
                    "searchMember",
                    "getWarnings"
                ]
            },

            {
                keywords: [
                    "desban",
                    "unban"
                ],
                tools: [
                    "searchMember",
                    "unbanMember"
                ]
            },

            {
                keywords: [
                    "limpar",
                    "purge",
                    "clear"
                ],
                tools: [
                    "purgeMessages"
                ]
            },

            {
                keywords: [
                    "lock",
                    "trancar"
                ],
                tools: [
                    "lockChannel"
                ]
            },

            {
                keywords: [
                    "unlock",
                    "destrancar"
                ],
                tools: [
                    "unlockChannel"
                ]
            },

            {
                keywords: [
                    "slowmode",
                    "modo lento"
                ],
                tools: [
                    "slowmodeChannel"
                ]
            }

        ],

        server: [

            {
                keywords: [
                    "servidor",
                    "server",
                    "informações do servidor",
                    "informacoes do servidor"
                ],
                tools: [
                    "getServerInfo"
                ]
            },

            {
                keywords: [
                    "canal",
                    "canais"
                ],
                tools: [
                    "getChannels"
                ]
            },

            {
                keywords: [
                    "categoria",
                    "categorias"
                ],
                tools: [
                    "getCategories"
                ]
            },

            {
                keywords: [
                    "emoji",
                    "emojis"
                ],
                tools: [
                    "getEmojis"
                ]
            },

            {
                keywords: [
                    "sticker",
                    "stickers",
                    "figurinha",
                    "figurinhas"
                ],
                tools: [
                    "getStickers"
                ]
            },

            {
                keywords: [
                    "boost",
                    "boosts",
                    "nitro"
                ],
                tools: [
                    "getBoostInfo"
                ]
            },

            {
                keywords: [
                    "regras",
                    "regra"
                ],
                tools: [
                    "getRules"
                ]
            }

        ],

        configuration: [

    {

        keywords: [

            "canal de logs",
            "logs",
            "log",
            "configurar logs",
            "definir logs",
            "setar logs"

        ],

        tools: [

            "setLogChannel"

        ]

    }

],

    };

    static select(intent, question = "") {

        const text = question.toLowerCase();

        const selected = new Set();

        const rules = this.rules[intent] || [];

        for (const rule of rules) {

            const matched = rule.keywords.some(keyword =>
                text.includes(keyword)
            );

            if (!matched) continue;

            for (const tool of rule.tools) {

                selected.add(tool);

            }

        }

        return fullSchema.filter(schema =>
            selected.has(schema.function.name)
        );

    }

}

module.exports = ToolSelector;