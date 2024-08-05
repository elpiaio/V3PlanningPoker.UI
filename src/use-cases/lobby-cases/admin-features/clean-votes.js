function CleanVotes(request) {
    divPlayers.innerHTML = '';
    const index = room.story.findIndex(story => story.id == activeStoryId);
    room.story[index].votes = [];

    usersList.forEach(user => {
        user.vote = null
    });

    userVote();
    renderUsers();
}