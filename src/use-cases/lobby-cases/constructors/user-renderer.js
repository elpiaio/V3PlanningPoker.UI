function insertUser(userData) {
    room.UserRoom.push(userData);
    var userObject = userData.user;
    usersList.push(userObject);
    userVote();

    const index = usersList.findIndex(userL => userL.id == userObject.id);
    usersList[index].element = createUsers(usersList[index]);
    divPlayers.appendChild(usersList[index].element);
    Toast(`${userObject.Name} entrou no chat`);
}

function createUsers(userData) {
    const user = document.createElement("div");
    user.classList.add("player");
    user.innerHTML = getUserContent(userData);
    return user;
}

function getUserContent(userData) {
    if (room.idAdmin == user.id) {
        const voteIcon = userData.vote == 'coffee' ? '<i class="ph ph-coffee"></i>' : userData.vote;
        return ` 
            <h2>
                <div class="user-status-root">
                    ${room.idAdmin == userData.id ? `<i class="ph ph-crown"></i>` : `<i class="ph ph-user-circle kick-user-icon" onclick="triggerModal('${userData.Name}', ${userData.id})"></i>`}
                    ${userData.status ? '<div class="player-status on"></div>' : '<div class="player-status off"></div>'}
                </div>
                <p>${userData.Name}</p>
            </h2>
            <div class="player-voto" id="player-voto-${userData.id}">
                ${userData.vote ? `<p>${userData.showVote ? voteIcon : '<i class="ph ph-check-circle"></i>'}</p>` : `<p></p>`} 
            </div>
        `;
    } else {
        const voteIcon = userData.vote == 'coffee' ? '<i class="ph ph-coffee"></i>' : userData.vote;
        return ` 
            <h2>
                <div class="user-status-root">
                    ${room.idAdmin == userData.id ? `<i class="ph ph-crown" onclick="triggerTutorial()"></i>` : `<i class="ph ph-user-circle kick-user-icon" onclick="triggerTutorial()"></i>`}
            ${userData.status ? '<div class="player-status on"></div>' : '<div class="player-status off"></div>'}
                </div>
                <p>${userData.Name}</p>
            </h2>
            <div class="player-voto" id="player-voto-${userData.id}">
                ${userData.vote ? `<p>${userData.showVote ? voteIcon : '<i class="ph ph-check-circle"></i>'}</p>` : `<p></p>`}
            </div>
        `;
    }
}

function renderUsers() {
    divPlayers.innerHTML = '';

    usersList = usersList.map(userData => {
        let element;

        if (!userData.element) {
            element = createUsers(userData);
        } else {
            element = userData.element;
            element.innerHTML = getUserContent(userData);
        }

        divPlayers.appendChild(element);

        if (userData.id == user.id) {
            user.vote = userData.vote;
        }

        return { ...userData, element };
    });

    hoverVote(user);
}