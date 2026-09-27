const plaintext = document.getElementById("plaintext");
const encryptKey = document.getElementById("encryptKey");
const ciphertext = document.getElementById("ciphertext");
const decryptKey = document.getElementById("decryptKey");
const decryptedText = document.getElementById("decryptedText");

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");

const encryptStatus = document.getElementById("encryptStatus");
const decryptStatus = document.getElementById("decryptStatus");


function setStatus(element, message, type = "") {
    element.textContent = message;
    element.className = `status ${type}`.trim();
}


function setLoading(button, loading, normalText, loadingText) {
    button.disabled = loading;
    button.textContent = loading ? loadingText : normalText;
}


function encrypt(text, key) {
    if (!key) {
        throw new Error("Encryption key cannot be empty.");
    }

    let bytes = [];

    for (let i = 0; i < text.length; i++) {
        const plain = text.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);

        const encrypted = (plain + keyChar) % 256;

        bytes.push(encrypted);
    }

    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary);
}


function decrypt(cipher, key) {
    if (!key) {
        throw new Error("Decryption key cannot be empty.");
    }

    const binary = atob(cipher);

    let plaintext = "";

    for (let i = 0; i < binary.length; i++) {
        const encrypted = binary.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);

        const decrypted =
            (encrypted - keyChar + 256) % 256;

        plaintext += String.fromCharCode(decrypted);
    }

    return plaintext;
}


function encryptMessage() {

    const text = plaintext.value;
    const key = encryptKey.value;

    if (!text.trim()) {
        setStatus(
            encryptStatus,
            "Please enter plaintext.",
            "error"
        );
        return;
    }

    if (!key) {
        setStatus(
            encryptStatus,
            "Please enter an encryption key.",
            "error"
        );
        return;
    }

    try {

        setLoading(
            encryptBtn,
            true,
            "Encrypt Message",
            "Encrypting..."
        );

        const result = encrypt(text, key);

        ciphertext.value = result;

        decryptKey.value = "";
        decryptedText.value = "";

        setStatus(
            encryptStatus,
            "Message encrypted successfully.",
            "success"
        );

        setStatus(decryptStatus, "");

    } catch (error) {

        setStatus(
            encryptStatus,
            error.message,
            "error"
        );

    } finally {

        setLoading(
            encryptBtn,
            false,
            "Encrypt Message",
            "Encrypting..."
        );
    }
}


function decryptMessage() {

    const cipher = ciphertext.value.trim();
    const key = decryptKey.value;

    if (!cipher) {
        setStatus(
            decryptStatus,
            "Please encrypt a message first.",
            "error"
        );
        return;
    }

    if (!key) {
        setStatus(
            decryptStatus,
            "Please enter a decryption key.",
            "error"
        );
        return;
    }

    try {

        setLoading(
            decryptBtn,
            true,
            "Decrypt Message",
            "Decrypting..."
        );

        const result = decrypt(cipher, key);

        decryptedText.value = result;

        if (key === encryptKey.value) {

            setStatus(
                decryptStatus,
                "Correct key — message decrypted successfully.",
                "success"
            );

        } else {

            setStatus(
                decryptStatus,
                "Decryption completed, but the key is different from the encryption key.",
                "error"
            );
        }

    } catch (error) {

        setStatus(
            decryptStatus,
            "Invalid encrypted message.",
            "error"
        );

    } finally {

        setLoading(
            decryptBtn,
            false,
            "Decrypt Message",
            "Decrypting..."
        );
    }
}


async function copyCiphertext() {

    if (!ciphertext.value) {

        setStatus(
            encryptStatus,
            "Nothing to copy yet.",
            "error"
        );

        return;
    }

    try {

        await navigator.clipboard.writeText(
            ciphertext.value
        );

        setStatus(
            encryptStatus,
            "Encrypted message copied.",
            "success"
        );

    } catch {

        setStatus(
            encryptStatus,
            "Copy failed.",
            "error"
        );
    }
}


function togglePassword(input, button) {

    const isPassword =
        input.type === "password";

    input.type =
        isPassword ? "text" : "password";

    button.textContent =
        isPassword ? "Hide" : "Show";
}


encryptBtn.addEventListener(
    "click",
    encryptMessage
);


decryptBtn.addEventListener(
    "click",
    decryptMessage
);


document
    .getElementById("copyCipher")
    .addEventListener(
        "click",
        copyCiphertext
    );


document
    .getElementById("toggleEncryptKey")
    .addEventListener(
        "click",
        () => {
            togglePassword(
                encryptKey,
                document.getElementById(
                    "toggleEncryptKey"
                )
            );
        }
    );


document
    .getElementById("toggleDecryptKey")
    .addEventListener(
        "click",
        () => {
            togglePassword(
                decryptKey,
                document.getElementById(
                    "toggleDecryptKey"
                )
            );
        }
    );