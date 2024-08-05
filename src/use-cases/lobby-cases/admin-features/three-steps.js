function identifyingTheStep() {
    if (room.storyActive) {
        const activeStory = findActiveStory();

        if (activeStory) {
            handleActiveStory(activeStory);
        } else {
            const nextStory = findUnvotedStoryExceptActive();
            activateStory(nextStory);
        }
    } else {
        const nextStory = findUnvotedStoryExceptActive();
        activateStory(nextStory);
    }
}

function activateStory(story) {
    if (story) {
        activatingStoryRequest(story.id);
    } else {
        addStoriesShowModal();
    }
}

function handleActiveStory(activeStory) {
    if (activeStory.voted) {
        const nextStory = findUnvotedStoryExceptActive();
        activateStory(nextStory);
    } else {
        if (!activeStory.showVotes) {
            reqShowVotes();
            showVotesAlert();
        } else {
            showResultsRequest();
        }
    }
}


function findActiveStory() {
    return stories.find(s => s.id === room.storyActive);
}

function findUnvotedStoryExceptActive() {
    return stories.find(s => s.voted === false && s.id!== room.storyActive);
}