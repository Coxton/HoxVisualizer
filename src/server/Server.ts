
import express, { Express } from "express";
import path from "node:path";

import { Server as HttpServer } from "node:http";
import { Server as WebSocketServer, WebSocket } from "ws";
import SpotifyAuth from "../integrations/spotify/SpotifyAuth";

export default class Server {
    private app: Express;
    private server?: HttpServer;
    private wss?: WebSocketServer;
    private clients: Set<WebSocket>;


    private latestPlayback: unknown = undefined;

    constructor(
        private readonly spotifyAuth: SpotifyAuth
    ) {
        this.app = express();
        this.clients = new Set();

        this.app.use(
            express.static(
                path.join(__dirname, "../renderer")
            )
        );

        this.app.get(
            "/spotify/callback",
            async (req, res) => {
                const code = req.query.code;
                const state = req.query.state;

                if (
                    typeof code !== "string" ||
                    typeof state !== "string"
                ) {
                    res.status(400).send(
                        "Spotify authentication failed."
                    );
                    return;
                }

                try {
                    await this.spotifyAuth.authenticate(
                        code,
                        state
                    );

                    res.send(
                        "Spotify authentication successful. You can close this window."
                    );
                } catch (error) {
                    console.error(
                        "Spotify authentication failed:",
                        error
                    );

                    res.status(500).send(
                        "Spotify authentication failed."
                    );
                }
            }
        );
    }

    start(): void {
        this.server = this.app.listen(3000, () => {
            console.log("Server listening on port 3000");
        });

        this.wss = new WebSocketServer({
            server: this.server
        });

        this.wss.on("connection", (socket) => {
            console.log("WebSocket client connected");

            this.clients.add(socket);

            // Synchronize newly connected clients.
            if (this.latestPlayback !== undefined) {
                this.sendToClient(socket, {
                    type: "playback",
                    data: this.latestPlayback
                });
            }

            socket.on("close", () => {
                this.clients.delete(socket);
                console.log("WebSocket client disconnected");
            });

            socket.on("error", (error) => {
                console.error(
                    "WebSocket client error:",
                    error
                );
            });
        });
    }


    broadcast(data: unknown): void {
        const message = JSON.stringify(data);

        this.broadcastMessage(message);
    }



    broadcastPlayback(playback: unknown): void {

        this.latestPlayback = playback;

        this.broadcastMessage(
            JSON.stringify({
                type: "playback",
                data: playback
            })
        );
    }


    private broadcastMessage(message: string): void {
        for (const client of this.clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    }

    private sendToClient(
        client: WebSocket,
        message: unknown
    ): void {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    }
}
