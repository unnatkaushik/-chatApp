let socket = io()
function scrollToView() {
    let message = document.querySelector('#abcd').lastElementChild;
    message.scrollIntoView()
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
    $('#chatContactTab').empty();
    users.forEach(function (user) {
        $('#chatContactTab').append(`<li class="contacts-item friends active"><a class="contacts-link" href="javascript:;"><div class="contacts-content"><div class="contacts-info"><h6 class="chat-name text-truncate">${user.name}</h6><div class="chat-time">${user.joinTime}</div></div></div></a></li>`)
    })
})

socket.on('updateGroupHeader', function (userCount, room) {
    $('#groupName').empty().append(room)

    $('#total-partocopants').empty().append(`${userCount} Participants`)
})

socket.on('newMessage', function (message) {
    console.log('newMessage', message)
    $("#abcd").append(`<div class="message"><div class="message-wrapper"><div class="message-content"><h6 class="text-dark">${message.from}</h6><span>${message.text}</span><br /><div class="message-options"><span class="message-date">${message.createdAt}</span></div></div></div></div>`);
    scrollToView();
})


socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message)
    $("#abcd").append(`<div class="message"><div class="message-wrapper"><div class="message-content"><h6 class="text-dark">${message.from}</h6> <a href="${message.url}" target="_blank">Current Location</a><br /><div class="message-options"><span class="message-date">${message.createdAt}</span></div></div></div></div>`);


})


document.querySelector('#submit-btn').addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
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
