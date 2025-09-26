// FIX: Add reference to Google Identity Services types to resolve 'google' namespace errors.
/// <reference types="google.accounts" />

import { GoogleUserProfile } from "../types";

// --- REAL GSI FRONTEND with MOCKED BACKEND ---
// This service uses the actual Google Identity Services (GSI) library for the sign-in UX,
// but simulates the backend part (code exchange) for demonstration purposes.

// Add your Google Cloud Client ID here.
// You can get one from: https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"; // TODO: Replace with your actual Client ID

type AuthStateChangedCallback = (user: GoogleUserProfile | null) => void;

class AuthService {
    private user: GoogleUserProfile | null = null;
    private onAuthStateChangedCallback: AuthStateChangedCallback | null = null;
    private codeClient: google.accounts.oauth2.CodeClient | null = null;

    init() {
        if (typeof google === 'undefined') {
            console.error("Google Identity Services script not loaded.");
            return;
        }

        if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
             console.warn("Google Client ID is not set. Authentication will not work.");
        }

        // Initialize the client
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleCredentialResponse, // For One Tap UI, not used in this flow
        });

        // Initialize the code client for the OAuth 2.0 flow
        this.codeClient = google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            ux_mode: 'popup',
            callback: this.handleCodeResponse,
        });

        // Check for a logged-in user in session storage
        const storedUser = sessionStorage.getItem('googleUser');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            this.notifyStateChange();
        }
    }

    onAuthStateChanged(callback: AuthStateChangedCallback) {
        this.onAuthStateChangedCallback = callback;
    }

    // FIX: Add mock getAccessToken method for calendarService dependency.
    // MOCK: In a real OAuth flow with a backend, the frontend wouldn't handle access tokens.
    // For this mock service, we'll return a dummy token if the user is signed in.
    async getAccessToken(): Promise<string | null> {
        if (this.user) {
            return 'mock-access-token';
        }
        return null;
    }

    signIn = () => {
        if (!this.codeClient) {
            console.error("Google Code Client not initialized.");
            alert("Authentication service is not ready. Please ensure you have replaced the placeholder Client ID.");
            return;
        }
        this.codeClient.requestCode();
    };

    signOut = () => {
        if (this.user) {
            google.accounts.id.revoke(this.user.id, () => {
                this.clearSession();
            });
        } else {
            this.clearSession();
        }
    };
    
    private clearSession = () => {
         this.user = null;
        sessionStorage.removeItem('googleUser');
        google.accounts.id.disableAutoSelect();
        console.log("Sign-out successful");
        this.notifyStateChange();
    }

    private handleCodeResponse = async (response: google.accounts.oauth2.CodeResponse) => {
        const code = response.code;
        console.log("Received auth code from Google:", code);

        // --- MOCK BACKEND EXCHANGE ---
        // In a real application, you would send this 'code' to your backend server.
        // Your backend would then securely exchange it with Google for an access token
        // and a refresh token, fetch the user's profile, create a session, and
        // return the user profile to the frontend.

        console.log("Simulating backend token exchange...");
        // Simulating a successful response from the backend:
        const mockUser: GoogleUserProfile = {
            id: '123456789',
            email: 'jee.aspirant@example.com',
            name: 'JEE Aspirant',
            given_name: 'JEE',
            family_name: 'Aspirant',
            picture: `https://i.pravatar.cc/150?u=jee.aspirant@example.com`,
        };
        
        this.user = mockUser;
        sessionStorage.setItem('googleUser', JSON.stringify(mockUser));
        console.log("Sign-in successful", this.user);
        this.notifyStateChange();
    };

    // This callback is for Google's One Tap sign-in, which we aren't using for the main button.
    private handleCredentialResponse = (response: any) => {
        console.log("Encoded JWT ID token: " + response.credential);
        // We are using the OAuth 2.0 flow, so this is just for reference.
    };

    private notifyStateChange() {
        if (this.onAuthStateChangedCallback) {
            this.onAuthStateChangedCallback(this.user);
        }
    }
}

export const authService = new AuthService();
