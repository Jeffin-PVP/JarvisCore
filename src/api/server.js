const path = require("path");

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const dashboardRoutes = require("./dashboardRoutes");


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

        // Painel do dono (arquivos estáticos servidos em /dashboard)
        this.app.use(
            "/dashboard",
            express.static(path.join(__dirname, "..", "..", "public", "dashboard"))
        );

    }


    start(port = 3000) {

        this.app.listen(port, () => {

            console.log(
                `🌐 API online na porta ${port}`
            );

            console.log(
                `🖥️ Dashboard em http://localhost:${port}/dashboard`
            );

        });

    }

}


module.exports = ApiServer;