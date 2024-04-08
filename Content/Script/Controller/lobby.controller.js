let data = [];
let usersList = [];
let loaded = false; // Variável para controlar se os dados foram carregados
const intlVar = new Intl.DateTimeFormat('pt-BR');
const user = JSON.parse(localStorage.getItem("userId"));
var ativo = false;

if (!loaded) { // Verifica se os dados já foram carregados
    getRoom().then(() => {
        stories();
        users();
        loaded = true; // Marca os dados como carregados
    });
}
const socket = new WebSocket(`ws://localhost:3005/channel/room/${localStorage.getItem("idRoom")}`);

socket.addEventListener('open', (event) => {
    console.log('Conectado ao servidor WebSocket Room');
});

socket.addEventListener('message', (event) => {
    const object = JSON.parse(event.data);
    console.log("ouvinte da room")

    if (object.type === 'story_deleted') {
        console.log("entrou no story deleted")
        data.stories = data.stories.filter((story) => story.id !== object.id);
        stories();
    }
    if (object.type === 'start_story') {
        console.log("entrou no start story")

    }
    if (object.type === 'add_story') {
        console.log("entrou no start story")

        data.stories.push(object);
        stories();
    }
});

async function getRoom() {
    var id = localStorage.getItem("idRoom");

    const result = await Handler({
        url: `room/${id}`,
        method: "GET"
    });

    const userResult = await Handler({
        url: `userRoom/${id}`,
        method: "GET"
    });

    data = result;
    usersList = userResult;
    console.log(usersList);
}

function stories() {
    var stories_content = document.querySelector(".stories-content");
    stories_content.innerHTML = ""; // Limpa o conteúdo existente

    data.stories.forEach(story => {
        stories_content.innerHTML += `
        <span class="story">
            <p>${story.storyName}</p>
            <p>${intlVar.format(new Date(story.createdAt))}</p>
            <div class="story-icons" style="font-size: 22px;">
                <a onclick="activatingStories(${story.id})"><i class="ph ph-play"></i></a>
                <a onclick="deleteStories(${story.id})"><i class="ph ph-trash"></i></a>
            </div>
        </span>
        `;
    });
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


async function deleteStories(id) {
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
        object = {
            storyId: storyId,
            type: "activating_Stories"
        }


    } catch (e) {
        alert(e)
    }
}


//Ouvinte de voto

let socketVote = new WebSocket(`ws://localhost:3005/channel/voto/62`);

socketVote.addEventListener('open', (event) => {
    console.log('Conectado ao servidor WebSocket Vote');
});

socketVote.addEventListener('message', (event) => {
    console.log("ouvindo voto")
    const object = JSON.parse(event.data)
    console.log(object);

    if (object.type === 'vote') {
        vote(object);
    }
    if (object.type === '') {
        localStorage.setItem("activeStorie", object.storyId)
        console.log("ativou o storie")
    }
    if (object.type === 'Voted') {

    }
    if (object.type === 'Voting') {

    }
    if (object.type === 'finish_Votation') {

    }
    if (object.type === 'show_Votes') {

    }
    if (object.type === 'show_Results') {

    }
    if (object.type === 'Refresh') {

    }

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