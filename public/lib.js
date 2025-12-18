// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`; // Add semicolon to handle cases where the cookie is the first one
    const parts = value.split(`; ${name}=`); // Split the string by the cookie name
    if (parts.length === 2)
        return parts.pop().split(';').shift(); // Return the cookie value
    return null; // If cookie doesn't exist, return null
}

function showSnackbar(message) {
    const snackbarContainer = document.getElementById('snackbar');
    snackbarContainer.classList.add("mdl-snackbar--active");
    snackbarContainer.MaterialSnackbar.showSnackbar({
        message: message,
        timeout: 1000 * 60 * 60,
        actionHandler: function (event) {
            snackbarContainer.classList.remove('mdl-snackbar--active');
        },
        actionText: 'OK'
    });
}

function vigenereDecode(encoded, key) {
    const encryptedBytes = Uint8Array.from(
        atob(encoded),
        c => c.charCodeAt(0)
    );

    const keyBytes = new TextEncoder().encode(key);
    const result = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {
        result[i] = (encryptedBytes[i] - keyBytes[i % keyBytes.length] + 256) % 256;
    }

    return new TextDecoder().decode(result);
}

function vigenereDecrypt(text, key) {
    key = key.toUpperCase();
    let result = "";
    let j = 0;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];

        if (/[A-Za-z]/.test(c)) {
            const code = c.charCodeAt(0);
            const keyCode = key.charCodeAt(j % key.length) - 65;

            if (code >= 65 && code <= 90)
                result += String.fromCharCode(((code - 65 - keyCode + 26) % 26) + 65);

            else if (code >= 97 && code <= 122)
                result += String.fromCharCode(((code - 97 - keyCode + 26) % 26) + 97);

            j++;
        } else {
            result += c;
        }
    }
    return result;
}