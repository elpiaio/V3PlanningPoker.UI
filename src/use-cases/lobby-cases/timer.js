function startTimer() {
    const index = room.story.findIndex(s => s.id == activeStoryId);
    try {
        startTime = stories[index].startedAt;
    } catch (error) {
        console.log(error)
        return;
    }

    if (!stories[index].voted) {
        timer = document.querySelector(`.timer-${stories[index].id}`);
        timer.innerHTML = '';
        intervalId = setInterval(updateTimer, 100);
    }
}

function stopTimer() {
    clearInterval(intervalId);
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
