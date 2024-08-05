let room = [];
let usersList = [];
let stories = [];

var lobbyButtons = document.querySelector(".lobby-buttons");
var storiesContent = document.querySelector(".stories-content");
var storiesCompletedContent = document.querySelector(".stories-completed-content")
var divPlayers = document.querySelector(".div-players")
var apresentation = document.querySelector(".apresentation");
var votationResult = document.querySelector(".votation-result")
var iconCopy = document.querySelector(".ph-copy")
var roomName = document.querySelector(".room-name")
var userName = document.querySelector(".user-name")

//var idOfRoom = localStorage.getItem("idRoom")
const intlVar = new Intl.DateTimeFormat('pt-BR');
const user = JSON.parse(localStorage.getItem("userId"));
var activeStoryId;
var admin = false

let intervalId;
let startTime;
var timer

let socket
let socketVote

showLoading()
idOfRoom = getUrlLobby()

const uuid = idOfRoom;

const wsSocketUrl = "ws://localhost:3005";

async function decodingUuid() {
    try {
        if (!idOfRoom) {
            alert("sala não encontrada, verifique o token de acesso!")
            return window.location.href = "../"
        }

        const simpleRoom = await Handler({
            url: `room/uuid/${idOfRoom}`,
            method: "GET"
        });

        if (!simpleRoom) {
            alert("sala não encontrada, verifique o token de acesso!")
            return window.location.href = "../"
        }
        idOfRoom = simpleRoom.id

        await userValidator()
        await automaticUserInsertion()

        try {
            const body = {
                status: true,
                userId: user.id,
                roomId: idOfRoom
            };

            await reqUpdateStatus(body);

        } catch (error) { console.log() }

        getRoom().then(() => {
            renderStory();
            userVote();
            renderUsers();
            startTimer()
            hoverVote(user)

            if (user.id == room.idAdmin) {
                createOptionsButtons();
                createSpyButton()
            }

            hideLoading()
        });

        socket = new WebSocket(`${wsSocketUrl}/channel/room/${idOfRoom}/${user.id}`);

        socket.addEventListener('open', (event) => {
            console.log('Conectado ao servidor WebSocket Room');
        });

        socket.addEventListener('message', (event) => {
            const object = JSON.parse(event.data);

            switch (object.type) {
                case 'story_deleted':
                    deleteStory(object.id);

                    break;

                case 'voting':
                    getRoom().then(() => {
                        storiesContent.innerHTML = '';
                        storiesCompletedContent.innerHTML = '';
                        divPlayers.innerHTML = '';
                        renderStory();
                        userVote();
                        renderUsers();
                        startTimer()

                        if (user.id == room.idAdmin) {
                            createOptionsButtons();
                        }

                        hoverVote(user)
                    })
                    break;

                case 'add_story':
                    room.story.push(object);
                    addStory(object);
                    break;

                case 'show_Votes':
                    showVotes(object);
                    break;

                case 'Clean':
                    CleanVotes(object);
                    break;

                case 'finish_Votation':
                    stopTimer()
                    chartConfig(object);
                    break;

                case 'insertUser':
                    insertUser(object);
                    break;

                case 'removeUser':
                    removeUser(object)

                    if (object.wasAdmin) {
                        newAdmin(object)
                    }
                    break;

                case 'newAdm':
                    newAdmin(object)
                    break;

                case 'deleteRoom':
                    alert("essa sala foi deletada!")
                    window.location.href = "../"
                    break;

                case 'updateStatus':
                    room.UserRoom = object.userRoom
                    //refazer
                    break;
            }
        });

    } catch (error) {
        console.log(error)
    }
}
decodingUuid()

async function getRoom() {
    const result = await Handler({
        url: `room/${idOfRoom}`,
        method: "GET"
    });

    room = result;
    stories = result.story;
    usersList = [];

    room.UserRoom.forEach((userData) => {
        var user = userData.user
        usersList.push(user)
    })

    activeStoryId = room.storyActive

    roomName.innerHTML = room.roomName;
    userName.innerHTML = user.Name;

    const some = stories.some(s => s.id == room.storyActive)

    if (!some) { room.storyActive = null }
    if (room.storyActive != null) { activeStory() }
}

function activeStory() {
    const index = stories.findIndex(s => s.id == room.storyActive)

    Toast(`o story "${stories[index].storyName}" está ativo!`)

    if (stories[index].voted) {
        chartConfig(stories[index])
    } else {
        lobbyButtons.style.display = "grid";
        apresentation.style.display = "none";
        votationResult.style.display = "none";
    }

    if (socketVote) {
        socketVote.close();
    }

    socketVote = new WebSocket(`${wsSocketUrl}/channel/voto/${Number(room.storyActive)}`);
    socketVote.addEventListener('open', (event) => {
        console.log(`Conectado ao servidor WebSocket Vote do story ${Number(room.storyActive)}`);
    });

    socketVote.addEventListener('message', (event) => {
        const vote = JSON.parse(event.data);

        if (vote.type == 'vote') {
            createVote(vote)
            newVote(vote)
        }
    });
}