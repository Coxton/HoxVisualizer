import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export default class SpotifyAuth {
    private readonly clientId: string;
    private readonly redirectUri: string;
    private readonly envPath: string;

    

    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private expiresAt: number | null = null;

    private codeVerifier: string | null = null;
    private state: string | null = null;

    constructor(
        redirectUri: string,
        envPath: string
    ) {
        this.clientId =
            process.env.SPOTIFY_CLIENT_ID ?? "";

        this.redirectUri =
            redirectUri;

        this.refreshToken =
            process.env.SPOTIFY_REFRESH_TOKEN ?? null;

        this.envPath =
            envPath;
    }

    isAuthenticated(): boolean {
        return this.refreshToken !== null;
    }




    //start the PKCE verifier process
    private generateCodeVerifier(): string {
        return crypto
            .randomBytes(64)
            .toString("base64url");
    }

    private generateCodeChallenge(
        codeVerifier: string
    ): string {
        
        return crypto
                    .createHash("sha256")
                    .update(codeVerifier)
                    .digest("base64url");

    }

    private generateState(): string {
        return crypto
                    .randomBytes(32)
                    .toString("base64url");
    }

    //construct the AuthorizationURL
    getAuthorizationURL(): string {

        const codeVerifier =
                this.generateCodeVerifier();

        const codeChallenge = 
                this.generateCodeChallenge(
                    codeVerifier
                );

        const state = 
                this.generateState();
            
        
        this.codeVerifier   = codeVerifier;
        this.state          = state;


        const params = 
                new URLSearchParams({
                    client_id: this.clientId,
                    response_type: "code",
                    redirect_uri: this.redirectUri,
                    state,
                    scope: "user-read-currently-playing",
                    code_challenge_method: "S256",
                    code_challenge: codeChallenge
                });

        return `https://accounts.spotify.com/authorize?${params}`;       

    }

    //Using the PKCE verifier and credentials
    //attempt to authenticate Spotify account 
    async authenticate(
            code:   string,
            state:  string,
    ): Promise<void> {
        if (
            !this.state ||
            state !== this.state
        ) {
            throw new Error(
                "Spotify authentication state mismatch"
            );
        }

        if (!this.codeVerifier) {
            throw new Error(
                "Spotify PKCE verifier is missing"
            );
        }

        const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type:     "authorization_code",
                    code,
                    redirect_uri:   this.redirectUri,
                    client_id:      this.clientId,
                    code_verifier:  this.codeVerifier
                })
            }
        )


        if (!response.ok) {
            throw new Error(
                `Spotify token exchange failed: ${response.status}`
            );
        }

        const data = await response.json();


        this.accessToken  = 
            data.access_token;

        this.refreshToken =
            data.refresh_token;

        if (!this.refreshToken) {
            throw new Error(
                "Spotify did not return a refresh token."
            );
        }

    await this.saveRefreshToken(
        this.refreshToken
    );


        this.expiresAt = 
            Date.now() +
            data.expires_in * 1000


    }

    //Refresh the access Token automatically using the RefreshToken
    private async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error(
                "Spotify refresh token is missing."
            );
        }

        const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: this.refreshToken,
                    client_id: this.clientId
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `Spotify token refresh failed: ${response.status}`
            );
        }

        const data = await response.json();

        this.accessToken =
            data.access_token;

        this.expiresAt =
            Date.now() +
            data.expires_in * 1000;

        if (data.refresh_token) {
            this.refreshToken =
                data.refresh_token;

            await this.saveRefreshToken(
                data.refresh_token
            );
        }
    }

    //attempt to get the AccessToken
    async getAccessToken(): Promise<string> {
        if (
            !this.accessToken ||
            !this.expiresAt ||
            Date.now() >= this.expiresAt
        ) {
            await this.refreshAccessToken();
        }

        if (!this.accessToken) {
            throw new Error(
                "Spotify access token is unavailable."
            );
        }

        return this.accessToken;
    }

    //save the RefreshToken to the env file
    private async saveRefreshToken(
        refreshToken: string
    ): Promise<void> {
        let content = "";

        try {
            content =
                await fs.readFile(
                    this.envPath,
                    "utf8"
                );
        } catch {
            // File does not exist yet.
        }

        const line =
            `SPOTIFY_REFRESH_TOKEN=${refreshToken}`;

        if (
            /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(content)
        ) {
            content =
                content.replace(
                    /^SPOTIFY_REFRESH_TOKEN=.*$/m,
                    line
                );
        } else {
            content =
                content.trimEnd() +
                (content ? "\n" : "") +
                line +
                "\n";
        }

        await fs.writeFile(
            this.envPath,
            content,
            "utf8"
        );
    }


}


