function removeUser(userData) {
    const userIndex = usersList.findIndex(user => user.id === userData.id);
    if (userIndex !== -1) {
        const userRemoving = usersList[userIndex];
        if (userRemoving.element) {
            userRemoving.element.remove();
            userRemoving.element = null;
        }
        usersList.splice(userIndex, 1);
        room.UserRoom.splice(userIndex, 1);
        Toast(`${userRemoving.Name} saiu da sala`);
        if (userData.id === user.id) {
            window.location.href = "../";
        }
    }
}