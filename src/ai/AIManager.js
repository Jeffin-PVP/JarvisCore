const groq = require("./groq");

const systemPrompt = require("./systemPrompt");

const ToolManager = require("./ToolManager");

const ToolPlanner = require("./ToolPlanner");

const ExecutionContext =
    require("./ExecutionContext");

class AIManager {

    /*
    =====================================
        CHAT NORMAL
    =====================================
    */

    static async chat({ message, question, context }) {

        const plan =
            await ToolPlanner.plan(question);

        // Nenhuma ferramenta necessária
        if (!plan.actions || plan.actions.length === 0) {

            const response =
                await groq.chat.completions.create({

                    model: "openai/gpt-oss-120b",

                    temperature: 0.3,

                    messages: [

                        {

                            role: "system",

                            content: systemPrompt

                        },

                        {

                            role: "user",

                            content: question

                        }

                    ]

                });

            return response
                .choices[0]
                .message
                .content;

        }

        const results = [];

        // Contexto da execução atual
        const execution =
            new ExecutionContext();

        // Executa todas as ferramentas
        for (const action of plan.actions) {

            console.log("\n====== TOOL ======");
            console.log(action.tool);

            console.log("====== ARGS ======");
            console.log(action.arguments);

            // Substitui a categoria criada anteriormente
            if (

                action.arguments?.parentCategory === "__LAST_CATEGORY__"

                &&

                execution.has("lastCategory")

            ) {

                action.arguments.parentCategory =
                    execution.get("lastCategory");

            }

            const result =
                await ToolManager.execute(

                    action.tool,

                    message,

                    action.arguments || {}

                );

            console.log("====== RESULT ======");
            console.log(result);

            // Guarda a última categoria criada
            if (

                action.tool === "createCategory"

                &&

                result.success

            ) {

                execution.set(

                    "lastCategory",

                    result.id

                );

            }

            results.push({

                tool: action.tool,

                result

            });

        }

        // Segunda chamada da IA
        const response =
            await groq.chat.completions.create({

                model: "openai/gpt-oss-120b",

                temperature: 0.2,

                messages: [

                    {

                        role: "system",

                        content: `
Você deve responder ao usuário utilizando APENAS os resultados das ferramentas.

Nunca invente informações.

Se alguma ferramenta falhou, explique o motivo.

Se todas funcionaram, informe o sucesso de forma natural.
`

                    },

                    {

                        role: "user",

                        content: `Pergunta:

${question}

Resultados:

${JSON.stringify(results, null, 2)}`

                    }

                ]

            });

        return response
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

                model: "openai/gpt-oss-120b",

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

        content = content

            .replace(/```json/gi, "")

            .replace(/```/g, "")

            .trim();

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