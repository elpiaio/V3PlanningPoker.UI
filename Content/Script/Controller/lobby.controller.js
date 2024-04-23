let room = [];
let usersList = [];
let stories = [];

var lobbyButtons = document.querySelector(".lobby-buttons");
var storiesContent = document.querySelector(".stories-content");
var storiesCompletedContent = document.querySelector(".stories-completed-content")
var divPlayers = document.querySelector(".div-players")
var apresentation = document.querySelector(".apresentation");
var votationResult = document.querySelector(".votation-result")
var inviteTokenText = document.querySelector(".invite-token-text")
var informationsName = document.querySelector(".informations-name")
var iconCopy = document.querySelector(".ph-copy")

const intlVar = new Intl.DateTimeFormat('pt-BR');
const user = JSON.parse(localStorage.getItem("userId"));
var idOfRoom = localStorage.getItem("idRoom")
var activeStoryId;
var admin = false

let intervalId;
let startTime;

let socket

if (!user || !idOfRoom) {
    window.location.href = "sub-pages/error.html"
}

async function decodingUuid() {

    try {
        const simpleRoom = await Handler({
            url: `room/uuid/${idOfRoom}`,
            method: "GET"
        });
        idOfRoom = simpleRoom.id

        getRoom().then(() => {
            renderStory();
            userVote();
            renderUsers();
            startTimer()
        });

        socket = new WebSocket(`ws://localhost:3005/channel/room/${idOfRoom}`);

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
                    })
                    break;

                case 'add_story':
                    room.story.push(object);
                    addStory(object);
                    break;

                case 'show_Votes':
                    showVotesFront(object);
                    break;

                case 'Refresh':
                    RefreshVotes(object);
                    break;

                case 'finish_Votation':
                    stopTimer()
                    showResultsFront(object);
                    break;

                case 'insertUser':
                    insertUser(object);
                    break;
            }
        });

    } catch (error) {
        alert(error)
    }
}
decodingUuid()

function insertUser(userData) {
    room.UserRoom.push(userData)

    var user = userData.user
    usersList.push(user)

    userVote();
    const element = createUsers(user);
    divPlayers.appendChild(element)

    Toast(`${user.Name} entrou no chat`)
}

function Toast(title) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    Toast.fire({
        icon: "info",
        title: title
    });
}

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

    inviteTokenText.textContent = room.ServerId;
    informationsName.textContent = user.Name

    if (window.location.pathname == "/Pages/LobbyAdm.html") {
        admin = true
    }

    const some = stories.some(s => s.id == room.storyActive)
    if (!some) {
        room.storyActive = null
    }

    if (room.storyActive != null) { activeStory() }
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

function createStory(storyData) {

    const story = document.createElement("div");
    story.classList.add("story");

    if (room.storyActive == storyData.id) story.classList.add("is-voting");

    var time
    if (storyData.finishAt) {
        time = formatedTime(new Date(storyData.finishAt).getTime() - new Date(storyData.startedAt).getTime())
    }

    const content = `
        <div class="story-name">
            <p>${storyData.storyName}</p>
        </div>
        <p class="timer-${storyData.id}">${storyData.voted ? time : intlVar.format(new Date(storyData.createdAt))}</p>
        <div class="story-icons">
            <a ${storyData.voted ? `onclick="visualizationModeRequest(${storyData.id})"` : `onclick="activatingStoryRequest(${storyData.id})"`}>${storyData.voted ? '<i class="ph ph-eye"></i>' : '<i class="ph ph-play"></i>'}</a>
            <a onclick="deleteStory(${storyData.id})"><i class="ph ph-trash"></i></a>
        </div>`;

    story.innerHTML = content;

    return story
}

function renderStory() {
    stories = stories.map(story => {
        const element = createStory(story);

        if (!story.voted) {
            storiesContent.appendChild(element);
        } else {
            storiesCompletedContent.appendChild(element);
        }

        return { ...story, element }
    });
}

var timer
function startTimer() {
    const index = room.story.findIndex(s => s.id == activeStoryId);
    startTime = stories[index].startedAt;

    if (!stories[index].voted) {
        timer = document.querySelector(`.timer-${stories[index].id}`);
        timer.innerHTML = '';
        intervalId = setInterval(updateTimer, 100); // Corrigido: removido os parênteses
    }
}

function stopTimer() {
    clearInterval(intervalId); // Limpa o intervalo para parar o contador
}

function updateTimer() {
    const elapsedTime = Date.now() - new Date(startTime).getTime();
    timer.textContent = formatedTime(elapsedTime)
}

function formatedTime(elapsedTime) {
    let hours = Math.floor(elapsedTime / (3600 * 1000));
    let minutes = Math.floor((elapsedTime % (3600 * 1000)) / (60 * 1000));
    let seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);

    hours = formatTime(hours);
    minutes = formatTime(minutes);
    seconds = formatTime(seconds);

    return `${hours}:${minutes}:${seconds}`;
}

function formatTime(time, digits = 2) {
    return time.toString().padStart(digits, '0');
}


function createUsers(userData) {

    const user = document.createElement("div");
    user.classList.add("player")

    if (userData.vote == 'coffee') {
        userData.vote = '<i class="ph ph-coffee"></i>';
    }

    const content = ` 
        <i class="ph ph-user-circle"></i>   
        <h2>${userData.Name}</h2>
        <div class="player-voto" id="player-voto-${userData.id}">
            ${userData.vote ? `<p>${userData.showVote ? userData.vote : '<i class="ph ph-check-circle"></i>'}</p>` : `<p></p>`}     
        </div>
    `;

    user.innerHTML = content;
    return user;
}

function renderUsers() {
    usersList = usersList.map(user => {
        const element = createUsers(user);
        divPlayers.appendChild(element)

        return { ...user, element }
    })
}

function userVote() {
    usersList = usersList.map((user) => {
        const element = createUsers(user);
        return {
            ...user,
            element
        }
    })


    const index = room.story.findIndex(s => s.id == activeStoryId);

    usersList = usersList.map(user => {

        let userVote = [];

        const story = room.story[index];

        if (story && story.votes) {
            userVote = story.votes.find(vote => vote.userId === user.id);
        }

        const showVotes = story ? story.showVotes : undefined; //chat GPT

        if (userVote) {
            return {
                ...user,
                vote: userVote.vote,
                showVote: showVotes
            };
        } else {
            return {
                ...user,
                showVote: showVotes
            };
        }
    });

    console.log(usersList);
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

    } catch (e) {
        alert(e)
    }
}

async function copyLinkInvite() {
    iconCopy.classList.replace("ph-copy", "ph-checks");
    var copyText = document.querySelector(".invite-token-text");

    try { await navigator.clipboard.writeText(copyText.textContent); } catch (err) { console.error('Failed to copy: ', err) }

    setTimeout(() => {
        iconCopy.classList.replace("ph-checks", "ph-copy");
    }, 500);
}

function showVotesFront(storyData) {
    var showVote = document.querySelector(".show-vote")

    const index = room.story.findIndex(story => story.id == storyData.id);
    room.story[index] = storyData;
    stories[index] = room.story[index]

    userVote();

    divPlayers.innerHTML = '';
    if (storyData.showVotes == true) {
        try {
            showVote.innerHTML = '<i class="ph ph-eye-slash"></i>';
        } catch { }
    } else {
        try {
            showVote.innerHTML = '<i class="ph ph-eye"></i>';
        } catch { }
    }
    renderUsers();
}

async function reqShowVotes() {
    try {
        const body = {
            storyId: activeStoryId
        }

        const result = await Handler({
            url: `story/showVotes/${idOfRoom}`,
            param: body,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

function RefreshVotes(request) {
    divPlayers.innerHTML = '';
    const index = room.story.findIndex(story => story.id == activeStoryId);
    room.story[index].votes = [];

    usersList.forEach(user => {
        user.vote = null
    });

    userVote();
    renderUsers();
}

async function reqRefreshVotes() {
    try {
        const body = {
            storyId: activeStoryId
        }

        const result = await Handler({
            url: `story/Refresh/${idOfRoom}`,
            param: body,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

let myLineChart;

function chartResults(labels, backgroundColors, counter) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'quantidade de votos: ',
            data: labels.map(label => counter[label]),
            backgroundColor: backgroundColors,
            hoverOffset: 8,
            borderWidth: 0,
        }]
    };

    const ctx = document.getElementById('myChart');

    if (myLineChart) {
        myLineChart.destroy(); // Destruir o gráfico existente
    }

    const config = {
        type: 'doughnut',
        data: data,
    };

    myLineChart = new Chart(ctx, config);
}

function showResultsFront(storyData) {

    votationResult.style.display = 'flex';
    lobbyButtons.style.display = "none";
    apresentation.style.display = "none";

    const index = room.story.findIndex(s => s.id == storyData.id);
    room.story[index] = storyData;
    stories[index] = storyData

    const counter = {};

    const votes = room.story[index].votes;
    votes.forEach(vote => {   //chatGPT
        if (counter[vote.vote]) {
            counter[vote.vote] += 1;
        } else {
            counter[vote.vote] = 1;
        }
    });

    const labels = Object.keys(counter);
    const backgroundColors = labels.map(() => randomColor());

    if (labels.length == 0) {
        Swal.fire({
            title: "Sem voto",
            text: "O story não possui voto!",
            icon: "info"
        });
    }

    chartResults(labels, backgroundColors, counter);
}

async function showResultsRequest() {
    try {
        const storyIdObject = {
            storyId: activeStoryId,
        }

        console.log(activeStoryId)

        const result = await Handler({
            url: `story/finishVotation/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function activatingStoryRequest(storyId) {
    try {
        const storyIdObject = {
            storyActive: storyId,
        }

        console.log(storyId)

        const result = await Handler({
            url: `activeStory/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function visualizationModeRequest(storyId) {
    try {
        const storyIdObject = {
            storyActive: storyId,
        }

        console.log(storyId)

        const result = await Handler({
            url: `story/visualizationMode/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

function activeStory() {

    const index = stories.findIndex(s => s.id == room.storyActive)

    Toast(`o story "${stories[index].storyName}" está ativo!`)

    if (stories[index].voted) {
        showResultsFront(stories[index])
    } else {
        lobbyButtons.style.display = "grid";
        apresentation.style.display = "none";
        votationResult.style.display = "none";
    }

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
    const playerVoto = document.querySelector(`#player-voto-${object.userId}`);

    const index = usersList.findIndex(user => user.id === object.userId);
    const userData = usersList[index];
    userData.vote = object.vote;

    playerVoto.innerHTML = '';

    if (userData.vote == 'coffee') {
        playerVoto.innerHTML = `
            <p>${userData.showVote ? '<i class="ph ph-coffee"></i>' : '<i class="ph ph-check-circle"></i>'}</p>
        `;
        return;
    }

    playerVoto.innerHTML = `
        <p>${userData.showVote ? userData.vote : '<i class="ph ph-check-circle"></i>'}</p>
    `;
}

//#region abrir e fechar tab
var st = document.querySelector(".stories-content")
var stc = document.querySelector(".stories-completed-content")
var buttonSt = document.querySelector(".button-st")
var buttonStc = document.querySelector(".button-stc")
st.style.display = "flex"
stc.style.display = "none"

buttonSt.style.backgroundColor = "rgb(41 42 38 / 50%)";
buttonStc.style.backgroundColor = "rgb(56, 56, 56)";

function openTab(idTab) {
    if (idTab == "stories-content") {
        st.style.display = "flex"
        stc.style.display = "none"

        buttonSt.style.backgroundColor = "rgb(41 42 38 / 50%)";
        buttonStc.style.backgroundColor = "rgb(56, 56, 56)";

    }
    if (idTab == "stories-completed-content") {
        stc.style.display = "flex";
        buttonStc.style.backgroundColor = "rgb(41 42 38 / 50%)";

        st.style.display = "none";
        buttonSt.style.backgroundColor = "rgb(56, 56, 56)";
    }
}
//#endregion
