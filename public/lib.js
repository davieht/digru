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