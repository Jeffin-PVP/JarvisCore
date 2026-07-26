class ContextManager {

    static build(intent, context) {

        switch (intent) {

            // ==========================
            // MODERAÇÃO
            // ==========================

            case "moderation":

                return `
=== CONTEXTO ===

Servidor:
- Nome: ${context.server.name}

Canal:
- Nome: #${context.channel.name}

Autor:
- Nome: ${context.author.username}
- Apelido: ${context.author.displayName}
- Cargos: ${context.author.roles.length
                        ? context.author.roles.join(", ")
                        : "Nenhum"
                    }
`;

            // ==========================
            // MEMBROS
            // ==========================

            case "members":

                return `
=== CONTEXTO ===

Servidor:
- Nome: ${context.server.name}

Canal:
- Nome: #${context.channel.name}

Autor:
- Nome: ${context.author.username}
`;

            // ==========================
            // SERVIDOR
            // ==========================

            case "server":

                return `
=== CONTEXTO ===

Servidor:
- Nome: ${context.server.name}
`;

            // ==========================
            // CONVERSA NORMAL
            // ==========================

            default:

                return `
=== CONTEXTO ===

Servidor:
- Nome: ${context.server.name}

Canal:
- Nome: #${context.channel.name}

Autor:
- Nome: ${context.author.username}
`;

        }

    }

}

module.exports = ContextManager;