let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().toLocaleTimeString()
    }
}

let generateLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://google.com/maps?q=${lat},${lng}`,
        createdAt: new Date().toLocaleTimeString()
    }
}
module.exports = { generateMessage, generateLocationMessage }