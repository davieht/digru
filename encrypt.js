function extendedVigenereCipher(plainText) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789;';
    const alphabetLength = alphabet.length; // 62 characters
    const textLength = plainText.length;
    const salt = 'sd89o2jfojwofcopu390';
    const keyLength = salt.length;

    let cipherText = '';

    for (let i = 0; i < textLength; i++) {
        const textChar = plainText[i];
        const keyChar = salt[i % keyLength]; // Repeat key as needed

        const textPos = alphabet.indexOf(textChar);
        const keyPos = alphabet.indexOf(keyChar);

        if (textPos === -1 || keyPos === -1) {
            throw new Error("Only characters A-Z, a-z, and 0-9 are allowed");
        }

        // Add positions and wrap around using modulo
        const cipherPos = (textPos + keyPos) % alphabetLength;
        cipherText += alphabet[cipherPos];
    }

    return cipherText;
}

function extendedVigenereDecipher(cipherText, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789;';
    const alphabetLength = alphabet.length; // 62 characters
    const textLength = cipherText.length;
    const keyLength = key.length;

    let plainText = '';

    for (let i = 0; i < textLength; i++) {
        const cipherChar = cipherText[i];
        const keyChar = key[i % keyLength]; // Repeat key as needed

        const cipherPos = alphabet.indexOf(cipherChar);
        const keyPos = alphabet.indexOf(keyChar);

        if (cipherPos === -1 || keyPos === -1) {
            throw new Error("Only characters A-Z, a-z, and 0-9 are allowed");
        }

        // Subtract positions and wrap around using modulo
        const plainPos = (cipherPos - keyPos + alphabetLength) % alphabetLength;
        plainText += alphabet[plainPos];
    }

    return plainText;
}

//// Example Usage
//const plainText = "HelloWorld123"; // String to cipher
//const key = "Key123"; // Key for the cipher
//
//const cipheredText = extendedVigenereCipher(plainText, key);
//console.log("Ciphered Text:", cipheredText);
//
//const decipheredText = extendedVigenereDecipher(cipheredText, key);
//console.log("Deciphered Text:", decipheredText);
