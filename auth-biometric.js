// auth-biometric.js - Versione Corretta per Browser
export async function attivaSensoreImpronta(codiceSalvato, callbackSuccesso) {
    if (!window.PublicKeyCredential) {
        alert("Il tuo browser non supporta la biometria o non sei in HTTPS.");
        return;
    }

    try {
        // Creiamo una sfida (challenge) casuale usando l'API di sistema
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Trasformiamo l'ID utente in un formato leggibile dal chip di sicurezza
        const userId = new TextEncoder().encode(codiceSalvato);

        const options = {
            publicKey: {
                challenge: challenge,
                rp: { name: "ShopyGO" },
                user: {
                    id: userId,
                    name: codiceSalvato,
                    displayName: codiceSalvato
                },
                pubKeyCredParams: [{ alg: -7, type: "public-key" }],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required"
                },
                timeout: 60000
            }
        };

        const credential = await navigator.credentials.create(options);
        
        if(credential) {
            callbackSuccesso(codiceSalvato);
        }
    } catch (err) {
        console.error("Errore sensore biometrico:", err);
        // Se l'utente clicca fuori o annulla, non mostriamo errori fastidiosi
    }
}
