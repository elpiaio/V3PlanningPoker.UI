function showLoading() {
    var centralize = document.createElement('div');
    centralize.classList.add('centralize');
    var loaderDiv = document.createElement('div');
    loaderDiv.classList.add('loader');

    for (var i = 0; i < 4; i++) {
        var circleDiv = document.createElement('div');
        circleDiv.classList.add('circle');
        loaderDiv.appendChild(circleDiv);
    }

    centralize.appendChild(loaderDiv);
    document.body.appendChild(centralize);
}

function hideLoading() {
    try {
        const loader = document.getElementsByClassName('centralize')
        loader[0].remove();
    } catch (error) {
        console.log(error)
    }
}