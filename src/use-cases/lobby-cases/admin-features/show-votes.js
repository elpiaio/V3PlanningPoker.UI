function showVotes(storyData) {
    var showVote = document.querySelector(".show-vote")

    const index = room.story.findIndex(story => story.id == storyData.id);
    room.story[index] = storyData;
    const element = stories[index].element
    stories[index] = room.story[index]
    stories[index].element = element

    userVote();

    divPlayers.innerHTML = '';
    if (storyData.showVotes == true) {
        try {
            showVote.innerHTML = '<i class="ph ph-eye"></i>';
        } catch { }
    } else {
        try {
            showVote.innerHTML = '<i class="ph ph-eye-slash"></i>';
        } catch { }
    }
    renderUsers();
}