function hoverVote(userData) {
    try {
        var card = document.querySelector(`.card[value="${userData.vote}"]`);

        document.querySelectorAll('.card').forEach(button => {
            button.classList.remove("voted-button")
        });

        card.classList.add("voted-button")
    } catch (error) { }
}

function createVote(object) {
    const playerVoto = document.querySelector(`#player-voto-${object.userId}`);

    const index = usersList.findIndex(user => user.id === object.userId);
    const storyIndex = room.story.findIndex(story => story.id === object.storyId);
    const voteIndex = room.story[storyIndex].votes.findIndex(vote => vote.userId === object.userId);

    room.story[storyIndex].votes[voteIndex] = object
    stories[storyIndex].votes[voteIndex] = object

    const userData = usersList[index];
    userData.vote = object.vote;
    user.vote = object.vote;

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
