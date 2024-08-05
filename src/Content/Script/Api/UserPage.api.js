async function reqJoinRoom(input) {
    const simpleRoom = await Handler({
        url: `room/uuid/${input}`,
        method: "GET"
    });

    if (!simpleRoom) return alert("sala não encontrada")

    const body = {
        userId: user.id,
        roomId: parseInt(simpleRoom.id)
    }

    const result = await Handler({
        url: `user/insert`,
        param: body,
        method: "POST"
    });

    localStorage.setItem("idRoom", input)
    window.location.href = `../Pages/Lobby.html?idroom=${input}`;
}

async function reqCreateRoom(input) {
    if (!input.trim()) { return alert("preencha o Nome") }
    if (input.length > 16) { return alert("O nome não pode conter mais que 16 caracteres") }

    const body = {
        roomName: input
    }
    const result = await Handler({
        url: `room/${user.id}`,
        param: body,
        method: "POST"
    });

    localStorage.setItem("idRoom", result.ServerId)
    window.location.href = `../Pages/Lobby.html?idroom=${result.ServerId}`;
}

async function reqDeleteRoom(roomId) {
    showLoading()
    const result = await Handler({
        url: `room/deleteRoom/${roomId}`,
        param: "{}",
        method: "DELETE"
    });

    if(result) {
        window.location.reload();
        hideLoading()
    }
    hideLoading()
}

async function reqGetUserValidation() {
    const result = await Handler({
        url: `user/${user.id}`,
        method: "GET"
    });

    return result
}