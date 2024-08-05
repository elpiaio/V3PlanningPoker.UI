function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

let myLineChart;

function chartResults(labels, backgroundColors, counter) {
    const data = {
        labels: labels,
        datasets: [{
            label: 'quantidade de votos',
            data: labels.map(label => counter[label]),
            backgroundColor: backgroundColors,
            hoverOffset: 8,
            borderWidth: 0,
        }]
    };

    const ctx = document.getElementById('myChart');

    if (myLineChart) {
        myLineChart.destroy(); // Destruir o gráfico existente
    }

    const config = {
        type: 'doughnut',
        data: data,
    };

    myLineChart = new Chart(ctx, config);
}

function chartConfig(storyData) {
    votationResult.style.display = 'flex';
    lobbyButtons.style.display = "none";
    apresentation.style.display = "none";

    const index = room.story.findIndex(s => s.id == storyData.id);
    room.story[index] = storyData;
    storyData.element = stories[index].element;
    stories[index] = storyData;

    if (storyData.element) {
        stories[index].element.remove()

        const element = createStory(storyData);

        if (!storyData.voted) {
            storiesContent.appendChild(element);
        } else {
            storiesCompletedContent.appendChild(element);
        }

        storyData.element = element
        stories[index].element = element
    }

    const counter = {};

    const votes = room.story[index].votes;
    votes.forEach(vote => {   //chatGPT
        if (counter[vote.vote]) {
            counter[vote.vote] += 1;
        } else {
            counter[vote.vote] = 1;
        }
    });

    const labels = Object.keys(counter);
    const backgroundColors = labels.map(() => randomColor());

    if (labels.length == 0) {
        Swal.fire({
            title: "Sem voto",
            text: "O story não possui voto!",
            icon: "info"
        });
    }

    chartResults(labels, backgroundColors, counter);
}
