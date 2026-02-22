// auth-biometric.js
export async function attivaSensoreImpronta(codiceSalvato, callbackSuccesso) {
    if (!window.PublicKeyCredential) {
        alert("Biometria non supportata su questo browser.");
        return;
    }

    try {
        // Generiamo una sfida casuale per "svegliare" il chip di sicurezza del Samsung
        const challenge = Buffer.from(Math.random().toString()).buffer;

        const options = {
            publicKey: {
                challenge: challenge,
                rp: { name: "ShopyGO" },
                user: {
                    id: Uint8Array.from(codiceSalvato, c => c.charCodeAt(0)),
                    name: codiceSalvato,
                    displayName: codiceSalvato
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required" // FORZA IL DITO
                },
                timeout: 60000
            }
        };

        // Questo attiva il popup nativo del sistema operativo (Android/Samsung)
        const credential = await navigator.credentials.create(options);
        
        if(credential) {
            callbackSuccesso(codiceSalvato);
        }
    } catch (err) {
        console.error("Errore sensore:", err);
        // Se l'utente annulla, non succede nulla, rimane alla schermata di login
    }
}
