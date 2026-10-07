import express, { Express } from "express";
import path from "node:path";

import { Server as HttpServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";

export default class Server {



    private app: Express;
    private server?: HttpServer;
    private wss?: WebSocketServer;
    private clients: Set<WebSocket>;



    constructor() {
        this.app = express();
        this.clients = new Set();

        this.app.use(
            express.static(
                path.join(__dirname, "../renderer")
            )
        );

    }



    start() {

        this.server = this.app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });

        this.wss = new WebSocketServer({
            server: this.server
        });


        this.wss.on("connection", (socket) => {
            console.log("WebSocket client connected");

            this.clients.add(socket);

            socket.on("close", () => {
                this.clients.delete(socket);
            })

        });

    }


    broadcast(data: unknown) {
        const message = JSON.stringify(data);

        for (const client of this.clients) {

            if (client.readyState === WebSocket.OPEN) {

                client.send(message);

            }

        }
    }

}