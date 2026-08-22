const groq = require("./groq");
const ToolManager = require("./ToolManager");

class ToolPlanner {

    static async plan(question) {

        const tools = ToolManager.getTools();

        const toolList = tools.map(tool => ({
            name: tool.function.name,
            description: tool.function.description,
            parameters: tool.function.parameters
        }));

        const response = await groq.chat.completions.create({

            model: "openai/gpt-oss-120b",

            temperature: 0,

            response_format: {
                type: "json_object"
            },

            messages: [

                {

                    role: "system",

                    content: `
Você é o planejador do JarvisCore.

Sua única função é criar um PLANO DE EXECUÇÃO.

Você nunca responde ao usuário.

Você apenas devolve JSON.

Formato obrigatório:

{
  "actions":[
    {
      "tool":"nomeDaFerramenta",
      "arguments":{}
    }
  ]
}

Regras:

- Planeje TODAS as etapas necessárias.
- Uma ferramenta por ação.
- Execute as ações na ordem correta.
- Nunca pule etapas.
- Nunca explique nada.
- Nunca escreva markdown.
- Nunca escreva texto fora do JSON.

Marcadores disponíveis:

__LAST_CATEGORY__
__LAST_ROLE__
__LAST_CHANNEL__
__LAST_MESSAGE__

Se uma ação depender da anterior, utilize os marcadores acima.

Exemplo:

Usuário:
Crie uma categoria Minecraft e dentro dela um canal chat.

Resposta:

{
  "actions":[
    {
      "tool":"createCategory",
      "arguments":{
        "name":"Minecraft"
      }
    },
    {
      "tool":"createTextChannel",
      "arguments":{
        "name":"chat",
        "parentCategory":"__LAST_CATEGORY__"
      }
    }
  ]
}

Se nenhuma ferramenta servir:

{
  "actions":[]
}
`

                },

                {

                    role: "user",

                    content: `

Pergunta:

${question}

Ferramentas disponíveis:

${JSON.stringify(toolList, null, 2)}

`

                }

            ]

        });

        let content =
            response.choices[0].message.content.trim();

        content = content
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        try {

            return JSON.parse(content);

        } catch (err) {

            console.error("\n===== JSON INVÁLIDO =====");
            console.error(content);
            console.error("=========================\n");

            throw err;

        }

    }

}

module.exports = ToolPlanner;