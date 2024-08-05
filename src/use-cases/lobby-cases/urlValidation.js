function getUrlLobby() {
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('idroom');

    return idRoom;
}

function getUrlLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('idroom');

    const loginLink = document.getElementById('link');
    loginLink.textContent = 'Or Create Account';
    loginLink.href = idRoom ? `../Pages/CreateAccount.html?idroom=${idRoom}` : `../Pages/CreateAccount.html`;
}

function getUrlRegister() {
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('idroom');

    const loginLink = document.getElementById('link');
    loginLink.textContent = 'Have account? Login';
    loginLink.href = idRoom ? `../Pages/Login.html?idroom=${idRoom}` : `../Pages/Login.html`;
}

function getUrlUserPage(userData) {
    const urlParams = new URLSearchParams(window.location.search);
    const idRoom = urlParams.get('idroom');

    if (idRoom) {
        localStorage.setItem("userId", JSON.stringify(userData))
        window.location.href = `Lobby.html?idroom=${idRoom}`;
        return true
    }
    return false
}