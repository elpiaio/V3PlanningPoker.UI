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

    if (room.storyActive == storyData.id) {
        story.classList.add("is-voting");

        if (storyData.voted == false) {
            openTab("stories-content")
        } else {
            openTab("stories-completed-content")
        }
    }

    var time
    if (storyData.finishAt) {
        time = formatedTime(new Date(storyData.finishAt).getTime() - new Date(storyData.startedAt).getTime())
    }

    const content = getStoryContent(storyData, time);
    story.innerHTML = content;
    return story
}

function getStoryContent(storyData, time) {
    if (room.idAdmin == user.id) {
        const content = `
            <div class="story-name">
                <p>${storyData.storyName}</p>
            </div>
            <p class="timer-${storyData.id}">${storyData.voted ? time : intlVar.format(new Date(storyData.createdAt))}</p>
            <div class="story-icons">
                <a ${storyData.voted ? `onclick="visualizationModeRequest(${storyData.id})"` : `onclick="activatingStoryRequest(${storyData.id})"`}>${storyData.voted ? '<i class="ph ph-eye"></i>' : '<i class="ph ph-play"></i>'}</a>
                <a onclick="deleteStory(${storyData.id})"><i class="ph ph-trash"></i></a>
            </div>`;

        return content
    } else {
        const content = `
            <div class="story-name">
                <p>${storyData.storyName}</p>
            </div>
            <p class="timer-${storyData.id}">${storyData.voted ? time : intlVar.format(new Date(storyData.createdAt))}</p>
            <div class="story-icons">
                <a onclick="triggerTutorial()"><i class="ph ph-question ph-no-function"></i></a>
            </div>`;

        return content
    }
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