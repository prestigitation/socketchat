export function auth_user(state, data) {
    console.log(data)
    state.user.id = data[0]
    state.user.name = data[1]
}

export function logout(state) {
    state.user.id = undefined
    state.user.name = undefined
    state.penmate.id = undefined
    state.penmate.name = undefined
    state.room = undefined
}

export function changePenmate(state, data) {
    state.penmate.id = data[0]
    state.penmate.name = data[1]
}

export function changeRoom(state, room_id) {
    state.room = room_id
}