function newAdmin(object) {
    if (object.newAdminId) { room.idAdmin = object.newAdminId }
    if (object.idAdmin) { room.idAdmin = object.idAdmin }

    const newKing = usersList.find(userr => userr.id == room.idAdmin)

    storiesContent.innerHTML = "";
    storiesCompletedContent.innerHTML = "";
    userVote();
    renderUsers();
    renderStory();
    startTimer()
    hoverVote(user)

    if (user.id == room.idAdmin) {
        createOptionsButtons();
        createSpyButton()
        renderSpyVotes()
    } else {
        removeOptionsButtons();
    }

    newAdminMessage(newKing)
}

function createOptionsButtons() {
    if (user.id != room.idAdmin) return
    const optionsButtons = document.querySelector('.options-buttons');

    optionsButtons.innerHTML = `
        <div class="options-buttons">
            <button class="add-stories button-adm" title="Adicionar Stories" onclick="addStoriesShowModal()">
                <i class="ph ph-plus"></i>
            </button>
            <button class="finish button-adm" title="Finalizar story" onclick="showResultsRequest()">
                <i class="ph ph-presentation-chart"></i>
            </button>
            
            <button onclick="identifyingTheStep()" title="Próximo passo">
                <i class="ph ph-skip-forward"></i>
            </button>

            <button class="show-vote" title="Exibir Votos" onclick="reqShowVotes()">
                <i class="ph ph-eye"></i>
            </button>
            <button class="refresh button-adm" title="reiniciar votação" onclick="activatingStoryRequest(room.storyActive)">
                <i class="ph ph-arrows-counter-clockwise"></i>
            </button>
        </div>
    `;
}


function createSpyButton() {
    const button = document.createElement('button');
    button.className = 'spy-button';

    const icon = document.createElement('i');
    icon.className = 'ph ph-detective';

    button.appendChild(icon);

    document.querySelector('.spy-root').appendChild(button);

    button.addEventListener('click', () => {
        renderSpyVotes();
    })
}

{/* <button class="clean button-adm" title="limpar votos" onclick="reqCleanVotes()">
                <i class="ph ph-broom"></i>
            </button> */}

function removeOptionsButtons() {
    const optionsButtons = document.querySelector('.options-buttons');
    const button = document.querySelector('.spy-button')
    button.remove()
    optionsButtons.innerHTML = "";
}