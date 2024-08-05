const user = JSON.parse(localStorage.getItem("userId"));
const intlVar = new Intl.DateTimeFormat('pt-BR');

var create_room_button = document.querySelector(".create-room-button");
var join_room_button = document.querySelector(".join-room-button")

let data = [];

async function initialDataLoad() {
    userValidator()

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
    var user_name = document.querySelector(".user-name");
    user_name.innerHTML = `<p>${user.Name}</p>`;

    var room_box = document.querySelector(".room-box");
    data.forEach(item => {
        room_box.innerHTML += `              
        <div class="room">
            <h2>${item.room.roomName}</h2>
            <h2 id="timer-${item.room.id}" class="room-date">${intlVar.format(new Date(item.room.createdAt))}</h2>
                <div class="icons-boxes">
                    <a href="#" id="link-room-${item.room.id}" class="enter-room-link"><i class="ph ph-sign-in link-enter-room"></i></a>
                    <i class="ph ph-link" idRoom="${item.room.ServerId}"></i>
                    ${item.room.idAdmin == user.id ? `<i class="ph ph-trash" onclick="reqDeleteRoom(${item.room.id})"></i>` : ""}
                </div>
        </div>
        `;
    });
}

var banner = document.querySelector(".banner");

create_room_button.addEventListener('click', async function () {
    swalActive('Create Room', 'Room name', 'create')
})

join_room_button.addEventListener('click', async function () {
    swalActive('Join Room', 'Token de acesso', 'join')
})

async function enterRoom(enter, input) {
    if (enter == "create") {
        try {
            reqCreateRoom(input)
        }
        catch (e) {
            alert(e)
        }
    }
    if (enter == "join") {
        try {
            reqJoinRoom(input);
        }
        catch (e) {
            alert(e)
        }
    }
}

function eventLink() {
    data.forEach(item => {
        var enterRoomLinks = document.querySelectorAll(`#link-room-${item.room.id}`);
        enterRoomLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                localStorage.setItem("idRoom", item.room.ServerId)
                window.location.href = `../Pages/Lobby.html?idroom=${item.room.ServerId}`;
            });
        });
    });
}


async function swalActive(action, inputType, enter) {
    const { value: formValues } = await Swal.fire({
        title: action,
        html: `
          <input placeholder="${inputType}" id="swal-input1" class="swal2-input">
        `,
        focusConfirm: false,
        confirmButtonColor: "#000000",
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
            ];
        }
    });

    if (formValues) { enterRoom(enter, formValues[0]) }
}