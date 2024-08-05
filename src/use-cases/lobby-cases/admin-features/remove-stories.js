function deleteStory(idStory) {
    const index = stories.findIndex(story => story.id == idStory);
    stories[index].element.remove();
    stories.splice(index, 1);
    reqDeleteStories(idStory);
}