
const ROOM_URL = "ROOM_URL"

const ROOM_INFO = "ROOM_INFO"


export function setRoomUrl(state) {
    localStorage.setItem(ROOM_URL, JSON.stringify(state))
}

export function getRoomUrl() {
    const data = localStorage.getItem(ROOM_URL)
    return data ? JSON.parse(data) : '{}'
}

export function setRoomInfo(state) {
    localStorage.setItem(ROOM_INFO, JSON.stringify(state))
}

export function getRoomInfo() {
    const data = localStorage.getItem(ROOM_INFO)
    return data ? JSON.parse(data) : '{}'
}

