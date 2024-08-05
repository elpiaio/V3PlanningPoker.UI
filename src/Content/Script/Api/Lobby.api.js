async function reqDeleteStories(id) {
    try {
        await Handler({
            url: `story/${id}`,
            param: "{}",
            method: "DELETE"
        });
    } catch (e) {
        alert(e)
    }
}

async function reqCreateStories(storyName) {
    try {
        const body = {
            storyName: storyName,
            roomId: Number(idOfRoom)
        }

        const result = await Handler({
            url: `story`,
            param: body,
            method: "POST"
        });

    } catch (e) {
        alert(e)
    }
}

async function reqCleanVotes() {
    try {
        const body = {
            storyId: activeStoryId
        }

        const result = await Handler({
            url: `story/Clean/${idOfRoom}`,
            param: body,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function reqShowVotes() {
    try {
        const body = {
            storyId: activeStoryId
        }

        const result = await Handler({
            url: `story/showVotes/${idOfRoom}`,
            param: body,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}


async function clickVote(vote) {
    try {
        user.vote = vote
        hoverVote({ vote })

        const body = {
            userId: user.id,
            vote: vote,
            storyId: room.storyActive
        }

        const result = await Handler({
            url: `vote`,
            param: body,
            method: "POST"
        });
    } catch (e) {
        console.log(e)
    }
}

async function showResultsRequest() {
    try {
        const storyIdObject = {
            storyId: activeStoryId,
        }

        const result = await Handler({
            url: `story/finishVotation/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function activatingStoryRequest(storyId) {
    try {
        const storyIdObject = {
            storyActive: storyId,
        }

        const result = await Handler({
            url: `activeStory/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function visualizationModeRequest(storyId) {
    try {
        const storyIdObject = {
            storyActive: storyId,
        }

        const result = await Handler({
            url: `story/visualizationMode/${idOfRoom}`,
            param: storyIdObject,
            method: "PUT"
        });

    } catch (e) {
        alert(e)
    }
}

async function reqInsertUser(idroom) {
    return new Promise(async (resolve, reject) => {
        try {
            const simpleRoom = await Handler({
                url: `room/uuid/${idroom}`,
                method: "GET"
            });

            if (!simpleRoom) {
                reject(new Error("Sala não encontrada"));
                return;
            }

            const body = {
                userId: user.id,
                roomId: parseInt(simpleRoom.id)
            };

            const result = await Handler({
                url: `user/insert`,
                param: body,
                method: "POST"
            });
            resolve(result);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

async function automaticUserInsertion() {
    try {
        await reqInsertUser(uuid);

    } catch (error) {
        console.log("Error occurred:", error);

    }
}

async function reqLeaveRoom(userId) {
    const body = {
        roomId: idOfRoom,
        userId: userId
    }

    const result = await Handler({
        url: `user/remove`,
        param: body,
        method: "delete"
    });

    return result
}

async function reqNewAdmin(userId) {
    const body = {
        idAdmin: userId,
    }

    const result = await Handler({
        url: `room/newAdm/${idOfRoom}`,
        param: body,
        method: "put"
    });

    return result
}

async function reqGetUserValidation() {
    const result = await Handler({
        url: `user/${user.id}`,
        method: "GET"
    });

    return result
}

async function reqUpdateStatus(body) {
    const result = await Handler({
        url: `user/updateStatus`,
        param: body,
        method: "PUT"
    });

    return result
}

async function reqGetNewVote(body) {
    const result = await Handler({
        url: `vote/getNewVote`,
        param: body,
        method: "post"
    });

    return result
}

async function reqGetVotes() {
    const result = await Handler({
        url: `vote/getVotes`,
        param: { id: room.storyActive },
        method: "post"
    });

    return result
}

