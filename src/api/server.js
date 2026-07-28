const express = require("express");
const cors = require("cors");

const routes = require("./routes");


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

    }


    start(port = 3000) {

        this.app.listen(port, () => {

            console.log(
                `🌐 API online na porta ${port}`
            );

        });

    }

}


module.exports = ApiServer;