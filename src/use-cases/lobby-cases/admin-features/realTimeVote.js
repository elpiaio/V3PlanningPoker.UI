async function newVote(object) {
    if (user.id != room.idAdmin) return;

    const body = {
        userId: object.userId,
        storyId: room.storyActive
    }

    const vote = await reqGetNewVote(body);

    const divSpyPlayers = document.querySelector(".div-spy-players");

    removeExistingPlayerVote(vote.user.id, divSpyPlayers);

    createSpyPlayer(vote, divSpyPlayers);
}

async function renderSpyVotes() {
    if (user.id != room.idAdmin) return;

    const rootSpyVotes = document.querySelector(".root-spy-votes");
    const divSpyPlayers = document.querySelector(".div-spy-players");
    rootSpyVotes.style.display = "flex";

    const story = await reqGetVotes();
    const votes = story.votes;

    votes.map((vote) => {
        removeExistingPlayerVote(vote.user.id, divSpyPlayers);
        return createSpyPlayer(vote, divSpyPlayers);
    });

    rootSpyVotes.addEventListener("click", () => {
        const spyPlayers = document.querySelectorAll(".spy-player")
        try {
            spyPlayers.forEach((spyPlayer) => {
                spyPlayer.remove();
            })
        } catch (error) { }

        rootSpyVotes.style.display = "none";
    });
}

function createSpyPlayer(vote, divSpyPlayers) {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'spy-player';
    playerDiv.setAttribute('data-user-id', vote.user.id);

    const namePlayer = document.createElement('h3');
    namePlayer.className = 'name-player';
    namePlayer.textContent = vote.user.Name;

    const votePlayer = document.createElement('h3');
    votePlayer.className = 'vote-player';
    votePlayer.textContent = vote.vote;

    playerDiv.appendChild(namePlayer);
    playerDiv.appendChild(votePlayer);

    divSpyPlayers.appendChild(playerDiv);
}

function removeExistingPlayerVote(userId, divSpyPlayers) {
    const existingPlayer = divSpyPlayers.querySelector(`.spy-player[data-user-id="${userId}"]`);
    if (existingPlayer) {
        divSpyPlayers.removeChild(existingPlayer);
    }
}
