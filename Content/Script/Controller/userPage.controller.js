const user = JSON.parse(localStorage.getItem("userId"));
const intlVar = new Intl.DateTimeFormat('pt-BR');

let data = [];

async function initialDataLoad() {
    if (!user) {
        alert("sua sessão expirou, faça o login novamente!")
        window.location.href = "LANDINGPAGE.html"
    }

    const result = await Handler({
        url: `user/rooms/${user.id}`,
        method: "GET"
    });
    data = result;
    html();
    eventLink();
}
initialDataLoad();

function html() {
    console.log("data", data);
    //user name
    var user_name = document.querySelector(".user-name");
    user_name.innerHTML = `<p>${user.Name}</p>`;

    //rooms //room-box
    var room_box = document.querySelector(".room-box");
    console.log(data.room);

    data.forEach(item => {
        room_box.innerHTML += `              
        <div class="room">
            <h2>${item.room.roomName}</h2>
            <h2 id="timer-${item.room.id}">${intlVar.format(new Date(item.room.createdAt))}</h2>
                <div class="icons-boxes">
                    <a href="#" id="link-room-${item.room.id}" class="enter-room-link"><i class="ph ph-sign-in link-enter-room"></i></a>
                    <i class="ph ph-link" idRoom="${item.room.ServerId}"></i>
                </div>
        </div>
        <br>
        `;
    });
}

var banner = document.querySelector(".banner");

var create_room_button = document.querySelector(".create-room-button");
create_room_button.addEventListener('click', async function () {
    banner.innerHTML = '';
    banner.innerHTML =
        `
        <div class="create-room">
            <H1>Create Room</H1>
            <input type="text" class="input-create-room" placeholder="Room Name">
            <button onclick="enterRoom('create')"><i class="ph ph-paper-plane-tilt"></i></button>
        </div>
    `;
})

var join_room_button = document.querySelector(".join-room-button")
join_room_button.addEventListener('click', async function () {
    banner.innerHTML = '';
    banner.innerHTML =
        `
        <div class="create-room">
            <H1>Join Room</H1>
            <input type="text" class="input-join-room" placeholder="Access Token">
             <button onclick="enterRoom('join')"><i class="ph ph-paper-plane-tilt"></i></button>
        </div>
    `;
})

async function enterRoom(enter) {
    var input_join_room = document.querySelector(".input-join-room")
    var input_create_room = document.querySelector(".input-create-room")

    if (enter == "create") {
        try {
            const body = {
                roomName: input_create_room.value
            }
            const result = await Handler({
                url: `room/${user.id}`,
                param: body,
                method: "POST"
            });

            localStorage.setItem("idRoom", result.ServerId)
            window.location.href = "LobbyAdm.html";
        }
        catch (e) {
            alert(e)
        }

    }
    if (enter == "join") {
        try {
            const simpleRoom = await Handler({
                url: `room/uuid/${input_join_room.value}`,
                method: "GET"
            });

            if(!simpleRoom) return alert("sala não encontrada")

            const body = {
                userId: user.id,
                roomId: parseInt(simpleRoom.id)
            }

            const result = await Handler({
                url: `user/insert`,
                param: body,
                method: "POST"
            });

            localStorage.setItem("idRoom", input_join_room.value)
            window.location.href = "LobbyAdm.html";
        }
        catch (e) {
            alert(e)
        }
    }
}

function eventLink() {
    data.forEach(item => {
        // Adiciona um event listener para cada link
        var enterRoomLinks = document.querySelectorAll(`#link-room-${item.room.id}`);
        enterRoomLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                // Lógica para entrar na sala com base no id da sala
                localStorage.setItem("idRoom", item.room.ServerId)
                window.location.href = "LobbyAdm.html";
            });
        });
    });
}
