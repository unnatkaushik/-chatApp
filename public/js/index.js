let socket = io()
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
socket.on('connect', function () {
    console.log('connected to server')
    //var parameterValue = decodeURIComponent(window.location.search.match(/(\?|&)user\=([^&]*)/)[2]);
    let searchQuery = window.location.search.substring(1)
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g, '":"') + '"}');


    socket.emit('join', params, function (err) {

        if (err) {
            alert(err),
                window.location.href = '/'
        }
    })
})
socket.on('disconnect', function () {
    console.log("disconnected from server")
})
socket.on('updateUserList', function (users) {
    console.log(users)
    users.forEach(function (user) {
        $('#chatContactTab').append(`<li class="contacts-item friends active"><a class="contacts-link" href="javascript:;"><div class="contacts-content"><div class="contacts-info"><h6 class="chat-name text-truncate">${user}</h6><div class="chat-time">Just now</div></div></div></a></li>`)
    })
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
    }, function () {
        $('#message-text').val('')
    })
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
