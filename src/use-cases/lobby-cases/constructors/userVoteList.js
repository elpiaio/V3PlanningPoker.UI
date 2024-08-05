function userVote() {
    usersList = usersList.map((user) => {
        let userVote = [];

        const index = room.story.findIndex(s => s.id == activeStoryId);
        const story = room.story[index];

        if (story && story.votes) {
            userVote = story.votes.find(vote => vote.userId === user.id);
        }

        const showVotes = story ? story.showVotes : undefined;

        const uniqueUserRoom = room.UserRoom.find(userR => userR.userId == user.id);

        if (userVote) {
            return {
                ...user,
                vote: userVote.vote ? userVote.vote : true,
                status: uniqueUserRoom.status,
                showVote: showVotes
            };
        } else {
            return {
                ...user,
                status: uniqueUserRoom.status,
                showVote: showVotes
            };
        }
    });
}