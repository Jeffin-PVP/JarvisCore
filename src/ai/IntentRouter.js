class IntentRouter {

    static intents = [

        {
            name: "configuration",

            keywords: [
                "log",
                "logs",
                "canal de logs",
                "configurar logs",
                "definir canal de logs",
                "setar canal de logs",
                "setlogchannel",
                "configuração",
                "configuracao",
                "configurar"
            ]
        },

        {
            name: "moderation",

            keywords: [
                "ban",
                "banir",
                "kick",
                "expulsar",
                "mute",
                "mutar",
                "timeout",
                "silenciar",
                "warn",
                "advert",
                "desban",
                "unban",
                "clear",
                "purge",
                "lock",
                "unlock",
                "slowmode"
            ]
        },

        {
            name: "members",

            keywords: [
                "membro",
                "usuário",
                "usuario",
                "perfil",
                "cargo",
                "permissão",
                "permissao",
                "status",
                "online",
                "offline",
                "quem é",
                "quem e",
                "id"
            ]
        },

        {
            name: "server",

            keywords: [
                "servidor",
                "server",
                "canal",
                "categoria",
                "emoji",
                "sticker",
                "figurinha",
                "boost",
                "regras"
            ]
        }

    ];

    static detect(question = "") {

        const text = question.toLowerCase();

        let best = {
            name: "chat",
            score: 0
        };

        for (const intent of this.intents) {

            let score = 0;

            for (const keyword of intent.keywords) {

                if (text.includes(keyword)) {

                    score++;

                }

            }

            if (score > best.score) {

                best = {

                    name: intent.name,

                    score

                };

            }

        }

        return best.name;

    }

}

module.exports = IntentRouter;