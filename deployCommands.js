require("dotenv").config();

const {
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const commands = [];



function loadCommands(dir) {


    const files = fs.readdirSync(dir);



    for (const file of files) {


        const filePath =
            path.join(dir, file);



        const stat =
            fs.statSync(filePath);



        if (stat.isDirectory()) {

            loadCommands(filePath);

            continue;

        }



        if (!file.endsWith(".js"))
            continue;



        const command =
            require(filePath);



        if (!command.data)
            continue;



        commands.push(
            command.data.toJSON()
        );


        console.log(
            `✔ Comando carregado: ${command.data.name}`
        );


    }


}



loadCommands(
    path.join(
        __dirname,
        "src",
        "commands"
    )
);



const rest = new REST({

    version: "10"

}).setToken(
    process.env.DISCORD_TOKEN
);



(async () => {


    try {


        console.log(
            "\n🔄 Atualizando comandos..."
        );



        await rest.put(


            Routes.applicationCommands(

                process.env.CLIENT_ID

            ),


            {

                body: commands

            }


        );



        console.log(
            `✅ ${commands.length} comando(s) registrado(s).`
        );



    } catch(error) {


        console.error(
            "❌ Erro ao registrar comandos:",
            error
        );


    }


})();