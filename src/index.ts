import express from "express";
let app = express();

function initServer(httpPort: number) {


    app.listen(httpPort,() => {
        console.log("server is running...");
    })
}