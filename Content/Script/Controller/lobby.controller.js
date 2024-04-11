let room = [];
let usersList = [];
let stories = [];

var storiesContent = document.querySelector(".stories-content");

let loaded = false; // Variável para controlar se os dados foram carregados
const intlVar = new Intl.DateTimeFormat('pt-BR');
const user = JSON.parse(localStorage.getItem("userId"));
const idOfRoom = localStorage.getItem("idRoom")
var ativo = false;

if (!loaded) { // Verifica se os dados já foram carregados
    getRoom().then(() => {
        renderStory();
        users();
        loaded = true; // Marca os dados como carregados
    });
}

const socket = new WebSocket(`ws://localhost:3005/channel/room/${idOfRoom}`);

socket.addEventListener('open', (event) => {
    console.log('Conectado ao servidor WebSocket Room');
});

socket.addEventListener('message', (event) => {
    const object = JSON.parse(event.data);
    console.log("ouvinte da room")

    if (object.type === 'story_deleted') {
        console.log("entrou no story deleted");
        deleteStory(object.id);
    }
    if (object.type === "voting") {
        console.log("entrou no start story")

        activeStory();
    }
    if (object.type === 'add_story') {
        console.log("entrou no adicionar story")
        room.story.push(object);
        addStory(object)
    }
});

async function getRoom() {
    const result = await Handler({
        url: `room/${idOfRoom}`,
        method: "GET"
    });

    const userResult = await Handler({
        url: `room/users/${idOfRoom}`,
        method: "GET"
    });

    room = result;
    stories = result.story;
    usersList = userResult;

    if (room.storyActive != null) { activeStory() }
}

async function getRoomId() {
    const result = await Handler({
        url: `room/${idOfRoom}`,
        method: "GET"
    });

    room = result;
}

async function handlerCreateStory(event) {
    var storyName = inputStory.value
    inputStory.value = "";

    var story = await reqCreateStories(storyName);
    addStory(story)
}

function deleteStory(idStory) {
    const index = stories.findIndex(story => story.id == idStory);
    stories[index].element.remove();
    stories.splice(index, 1);
    reqDeleteStories(idStory);
}

function addStory(story) {
    const exist = stories.some(s => s.id == story.id);

    if (!exist) {
        const element = createStory(story);
        story.element = element;
        storiesContent.appendChild(element);
        stories.push(story);
    }
}

function renderStory() {

    stories = stories.map(story => {
        const element = createStory(story);
        storiesContent.appendChild(element);

        return { ...story, element }
    });
}

function createStory(storyData) {

    const story = document.createElement("div");
    story.classList.add("story");

    if (room.storyActive == storyData.id) story.classList.add("is-voting");

    const content = `
        <div class="story-name">
            <p>${storyData.storyName}</p>
        </div>
        <p>${intlVar.format(new Date(storyData.createdAt))}</p>
        <div class="story-icons">
            <a onclick="activatingStoryRequest(${storyData.id})"><i class="ph ph-play"></i></a>
            <a onclick="deleteStory(${storyData.id})"><i class="ph ph-trash"></i></a>
        </div>`;

    story.innerHTML = content;

    return story
}

function users() {
    var div_players = document.querySelector(".div-players")
    div_players.innerHTML = '';

    usersList.forEach(user => {
        div_players.innerHTML += `
            <span class="player">
                <i class="ph ph-user-circle-gear"></i>
                <h2>${user.Name}</h2>
                <div class="player-voto" id="player-voto-${user.id}">
                    
                </div>
            </span>
        `;
    })
}

async function reqDeleteStories(id) {
    try {
        await Handler({
            url: `story/${id}`,
            param: null,
            method: "DELETE"
        });
    } catch (e) {
        alert(e)
    }
}

async function reqCreateStories(storyName) {
    try {
        const body = {
            storyName: storyName,
            roomId: Number(idOfRoom)
        }

        const result = await Handler({
            url: `story`,
            param: body,
            method: "POST"
        });

        if (result) {
            return result
        }

    } catch (e) {
        alert(e)
    }
}

async function activatingStoryRequest(storyId) {
    try {
        const storyIdObject = {
            storyActive: storyId,
        }

        const result = await Handler({
            url: `activeStory/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

        if (result) {
            room = result;
        }

    } catch (e) {
        alert(e)
    }
}

function activeStory() {
    var lobbyButtons = document.querySelector(".lobby-buttons");
    var apresentation = document.querySelector(".apresentation");

    lobbyButtons.style.display = "grid";
    apresentation.style.display = "none";

    let socketVote

    if (socketVote) {
        socketVote.close();
    }

    socketVote = new WebSocket(`ws://localhost:3005/channel/voto/${Number(room.storyActive)}`);
    socketVote.addEventListener('open', (event) => {
        console.log(`Conectado ao servidor WebSocket Vote do story ${Number(room.storyActive)}`);
    });

    socketVote.addEventListener('message', (event) => {
        const vote = JSON.parse(event.data);
    
        if (vote.type == 'vote') {
            createVote(vote)
        }
        console.log(vote)
    });
}

async function clickVote(vote) {
    try {
        const body = {
            userId: user.id,
            vote: vote,
            storyId: room.storyActive
        }

        const result = await Handler({
            url: `vote`,
            param: body,
            method: "POST"
        });

    } catch (e) {
        console.log(e)
    }

}

function createVote(object) {
    var player_voto = document.querySelector(`#player-voto-${object.userId}`);

    player_voto.innerHTML = `
        <p>${object.vote}</p>
    `;
}

//#region abrir e fechar tab
var st = document.querySelector(".stories-content")
var stc = document.querySelector(".stories-completed-content")
var buttonSt = document.querySelector(".button-st")
var buttonStc = document.querySelector(".button-stc")
st.style.display = "flex"
stc.style.display = "none"

buttonSt.style.backgroundColor = "rgba(58, 69, 40, 0.5)";
buttonStc.style.backgroundColor = "rgb(56, 56, 56)";

function openTab(idTab) {
    if (idTab == "stories-content") {
        st.style.display = "flex"
        stc.style.display = "none"

        buttonSt.style.backgroundColor = "rgba(58, 69, 40, 0.5)";
        buttonStc.style.backgroundColor = "rgb(56, 56, 56)";

    }
    if (idTab == "stories-completed-content") {
        stc.style.display = "flex";
        buttonStc.style.backgroundColor = "rgba(58, 69, 40, 0.5)";

        st.style.display = "none";
        buttonSt.style.backgroundColor = "rgb(56, 56, 56)";
    }
}
//#endregion