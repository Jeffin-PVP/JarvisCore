const groq = require("./groq");

const systemPrompt = require("./systemPrompt");

const ToolManager = require("./ToolManager");

const IntentRouter = require("./IntentRouter");

const ToolSelector = require("./ToolSelector");

const ContextManager = require("./ContextManager");

class AIManager {

    static async chat({ message, question, context }) {

        // Detecta a intenção
        const intent = IntentRouter.detect(question);

        // Seleciona apenas as ferramentas necessárias
        const selectedTools = ToolSelector.select(
            intent,
            question
        );

        // Monta o contexto conforme a intenção
        const promptContext = ContextManager.build(
            intent,
            context
        );

        // Histórico
        const messages = [

            {

                role: "system",

                content: systemPrompt

            },

            {

                role: "user",

                content: `
${promptContext}

=== PERGUNTA ===

${question}
`

            }

        ];

        // Primeira chamada
        const firstResponse = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages,

            tools: selectedTools,

            tool_choice: "auto",

            temperature: 0.3

        });

        const assistantMessage = firstResponse.choices[0].message;

        // Caso não utilize ferramentas
        if (!assistantMessage.tool_calls) {

            return assistantMessage.content;

        }

        // Adiciona resposta da IA
        messages.push(assistantMessage);

        // Executa todas as ferramentas
        for (const toolCall of assistantMessage.tool_calls) {

            const toolName = toolCall.function.name;

            let args = {};

            try {

                args = JSON.parse(
                    toolCall.function.arguments || "{}"
                );

            } catch {

                args = {};

            }

            const result = await ToolManager.execute(

                toolName,

                message,

                args

            );

            messages.push({

                role: "tool",

                tool_call_id: toolCall.id,

                content: JSON.stringify(result)

            });

        }

        // Segunda chamada
        const secondResponse = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages,

            temperature: 0.3

        });

        return secondResponse.choices[0].message.content;

    }

}

module.exports = AIManager;