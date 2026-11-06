# MAIRA Firebase Authentication setup

The account page is `/account.html` and uses Firebase Authentication Email/Password.

## One-time Firebase setup

1. Open the MAIRA Firebase project with Project ID `maira-3d4b0`.
2. Open Authentication → Sign-in method and enable Email/Password. Keep Email link/passwordless disabled unless you intentionally need it.
3. Open Project settings → General → Your apps → MAIRA Web.
4. Under SDK setup and configuration, choose Config and copy the web-app config values into the matching fields in `firebase-config.js`.
5. In Authentication → Settings → Authorized domains, ensure the exact domain serving MAIRA is listed. Test using a local HTTP server or the deployed HTTPS site, not a `file://` URL.
6. Deploy this branch and open `/account.html` to test signup, logout, login, and password reset.

## Security notes

- Firebase Web App config is designed for browser apps; it is not a service-account private key. Never commit service-account JSON, private keys, passwords, or admin credentials.
- Protect Firestore and Storage data separately with Security Rules. Hiding a page behind a login screen is not data security.
- This first step adds the account page. The existing chat page is not yet restricted to signed-in members; complete app integration and data rules before treating the whole app as members-only.
