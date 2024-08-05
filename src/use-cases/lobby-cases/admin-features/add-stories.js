var buttonAddStory = document.querySelector(".add-stories")
var addStoryDialog = document.querySelector("#add-story-dialog")
var buttonSend = document.querySelector(".button-send")
var inputStory = document.querySelector(".input-story")

function addStoriesShowModal() {
    addStoryDialog.showModal();
}

buttonSend.addEventListener('click', () => {
    if (!inputStory.value.trim()) { return alert("preencha o Nome") }
    if (inputStory.value.length > 16) { return alert("O nome não pode conter mais que 16 caracteres") }

    handlerCreateStory();
});

inputStory.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!inputStory.value.trim()) { return alert("preencha o Nome") }
        if (inputStory.value.length > 16) { return alert("O nome não pode conter mais que 16 caracteres") }

        handlerCreateStory();
    }
});

async function handlerCreateStory(event) {
    var storyName = inputStory.value
    inputStory.value = "";

    var story = await reqCreateStories(storyName);
    addStory(story)
}