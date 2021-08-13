let socket = io()

socket.on('connect', function () {
    console.log('connected to server')
})
socket.on('disconnect', function () {
    console.log("disconnected from server")
})

socket.on('newMessage', function (message) {
    console.log('newMessage', message)
    $("#abcd").append(`<div class="message"><div class="message-wrapper"><div class="message-content"><span>${message.text} </span></div></div></div>`);
})




socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message)
    $("#location-tag").attr("href", message.url).text(message.from).attr("target", '_blank')
})


document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "user",
        text: document.querySelector('#message-text').value
    }, function () { })
})

document.querySelector('#location-share').addEventListener('click', function (e) {
    e.preventDefault()
    if (!navigator.geolocation) {
        return alert("geolocation not supported")
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log(position.coords.latitude)
        socket.emit('createLocationMessage', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    }, function () {
        alert('unable to fetch position')
    })
})