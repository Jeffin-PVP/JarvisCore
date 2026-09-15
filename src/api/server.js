const path = require("path");

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const dashboardRoutes = require("./dashboardRoutes");
const panelRoutes = require("./panelRoutes");


class ApiServer {

    constructor(client) {

        this.client = client;

        this.app = express();

        this.app.use(cors());
        this.app.use(express.json());

        this.app.get("/", (req, res) => {

            res.send("JarvisCore API funcionando!");

        });

        this.app.use(
            "/api",
            routes(client)
        );

        this.app.use(
            "/api/dashboard",
            dashboardRoutes(client)
        );

        this.app.use(
            "/api/panel",
            panelRoutes(client)
        );

        // Painel do dono (arquivos estáticos servidos em /dashboard)
        this.app.use(
            "/dashboard",
            express.static(path.join(__dirname, "..", "..", "public", "dashboard"))
        );

        // Painel do servidor, login com Discord (arquivos estáticos em /panel)
        this.app.use(
            "/panel",
            express.static(path.join(__dirname, "..", "..", "public", "panel"))
        );

    }


    start(port = 3000) {

        this.app.listen(port, () => {

            console.log(
                `🌐 API online na porta ${port}`
            );

            console.log(
                `🖥️ Dashboard do dono em http://localhost:${port}/dashboard`
            );

            console.log(
                `🖥️ Painel de servidor em http://localhost:${port}/panel`
            );

        });

    }

}


module.exports = ApiServer;