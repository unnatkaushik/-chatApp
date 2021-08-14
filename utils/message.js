let generateMessage = (_id, from, text) => {
    return {
        _id,
        from,
        text,
        createdAt: new Date().toLocaleTimeString()
    }
}

let generateLocationMessage = (_id, from, lat, lng) => {
    return {
        _id,
        from,
        url: `https://google.com/maps?q=${lat},${lng}`,
        createdAt: new Date().toLocaleTimeString()
    }
}
module.exports = { generateMessage, generateLocationMessage }