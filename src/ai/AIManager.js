const groq = require("./groq");

const systemPrompt = require("./systemPrompt");

const ToolManager = require("./ToolManager");

const IntentRouter = require("./IntentRouter");

const ToolSelector = require("./ToolSelector");

const ContextManager = require("./ContextManager");

class AIManager {

    /*
    =====================================
        CHAT NORMAL
    =====================================
    */

    static async chat({ message, question, context }) {

        const intent = IntentRouter.detect(question);

        const { tools: selectedTools, forceToolUse } = ToolSelector.select(
            intent,
            question
        );

        const promptContext = ContextManager.build(
            intent,
            context
        );

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

        const firstResponse = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages,

            tools: selectedTools,

            tool_choice: forceToolUse ? "required" : "auto",

            temperature: 0.15

        });

        const assistantMessage =
            firstResponse.choices[0].message;

        if (!assistantMessage.tool_calls) {

            return assistantMessage.content;

        }

        messages.push(assistantMessage);

        for (const toolCall of assistantMessage.tool_calls) {

            const toolName =
                toolCall.function.name;

            let args = {};

            try {

                args = JSON.parse(
                    toolCall.function.arguments || "{}"
                );

            } catch {

                args = {};

            }

            const result =
                await ToolManager.execute(

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

        const secondResponse =
            await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                messages,

                temperature: 0.15

            });

        return secondResponse
            .choices[0]
            .message
            .content;

    }

    /*
    =====================================
        GERADOR DE EMBEDS
    =====================================
    */

    static async generateEmbed(prompt) {

        const response =
            await groq.chat.completions.create({

                model: "llama-3.3-70b-versatile",

                temperature: 0.15,

                messages: [

                    {

                        role: "system",

                        content: `
Você é um especialista em criar Embeds para Discord.

Sua resposta deve ser APENAS um JSON válido.

Formato:

{
  "title": "",
  "description": "",
  "color": "#5865F2",

  "author": {
    "name": "",
    "iconURL": "",
    "url": ""
  },

  "footer": {
    "text": "",
    "iconURL": ""
  },

  "thumbnail": "",

  "image": "",

  "timestamp": false,

  "fields": [

    {

      "name": "",

      "value": "",

      "inline": false

    }

  ]

}

Regras:

- Nunca escreva markdown.
- Nunca utilize \`\`\`json.
- Nunca explique nada.
- Apenas JSON válido.
- Se um campo não for necessário, deixe vazio.
`

                    },

                    {

                        role: "user",

                        content: prompt

                    }

                ]

            });

        let content =
            response.choices[0]
                .message.content
                .trim();

        console.log("===== RESPOSTA DA IA =====");
        console.log(content);

        // Remove markdown
        content = content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Caso a IA escreva texto antes do JSON
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");

        if (start !== -1 && end !== -1) {

            content = content.substring(
                start,
                end + 1
            );

        }

        try {

            return JSON.parse(content);

        } catch (err) {

            console.error("Erro ao converter JSON:");
            console.error(content);

            throw err;

        }

    }

}

module.exports = AIManager;