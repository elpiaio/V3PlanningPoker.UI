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
        renderRoom();
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
    if (object.type === "Voting") {
        console.log("entrou no start story")

        getRoomId();
    }
    if (object.type === 'add_story') {
        console.log("entrou no adicionar story")

        room.story.push(object);
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
}

async function getRoomId() {
    const result = await Handler({
        url: `room/${idOfRoom}`,
        method: "GET"
    });

    room = result;
}


function deleteStory(idStory) {
    const index = stories.findIndex(story => story.id == idStory);
    stories[index].element.remove();
    stories.splice(index, 1);
    reqDeleteStories(idStory);
}

function renderRoom() {
    // var lobbyButtons = document.querySelector(".lobby-buttons");
    // var apresentation = document.querySelector(".apresentation");

    stories = stories.map(story => {
        console.log(story);
        const element = createStory(story);
        storiesContent.appendChild(element);

        return { ...story, element }
    });
}

function createStory(storyData) {
    const story = document.createElement("div");
    story.classList.add("story");

    if(storyData.voting == true) story.classList.add("is-voting");

    const content = `
        <p>${storyData.storyName}</p>
        <p>${intlVar.format(new Date(storyData.createdAt))}</p>
        <div class="story-icons">
            <a onclick="activatingStories(${storyData.id})"><i class="ph ph-play"></i></a>
            <a onclick="deleteStories(${storyData.id})"><i class="ph ph-trash"></i></a>
        </div>`;

    story.innerHTML = content;
    
    return story
}

function users() {
    var div_players = document.querySelector(".div-players")
    div_players.innerHTML = '';

    console.log(usersList)

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
        const result = await Handler({
            url: `story/${id}`,
            param: null,
            method: "DELETE"
        });
    } catch (e) {
        alert(e)
    }
}

async function activatingStories(storyId) {
    try {
        const object = {
            storyId: storyId,
        }

        const result = await Handler({
            url: `story/Voting/${idOfRoom}`,
            param: object,
            method: "PUT"
        });

        console.log(result)
    } catch (e) {
        alert(e)
    }
}

var addStory = document.querySelector(".add-stories")
var addStoryDialog = document.querySelector("#add-story-dialog")
var buttonSend = document.querySelector(".button-send")
var inputStory = document.querySelector(".input-story")

addStory.addEventListener('click', function () {
    addStoryDialog.showModal();
})

buttonSend.addEventListener('click', function() {
    var storyName = inputStory.value
})



//Ouvinte de voto

let socketVote = new WebSocket(`ws://localhost:3005/channel/voto/62`);

socketVote.addEventListener('open', (event) => {
    console.log('Conectado ao servidor WebSocket Vote');
});

socketVote.addEventListener('message', (event) => {
    const vote = JSON.parse(event.data);

    console.log(vote);
});

async function clickVote(vote) {
    const body = {
        userId: user.id,
        vote: vote,
        storyId: 62 //localStorage.getItem("activeStorie")
    }

    const result = await Handler({
        url: `vote`,
        param: body,
        method: "POST"
    });

    console.log(result)
}

function vote(object) {
    var player_voto = document.querySelector(`#player-voto-${object.userId}`);

    console.log(object)
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