export function auth(context, data) {
    context.commit('auth_user', data)
}

export function logout(context) {
    context.commit('logout')
}

export function penmate(context, data) {
    context.commit('changePenmate', data)
}

export function room(context, room_id) {
    context.commit('changeRoom', room_id)
}