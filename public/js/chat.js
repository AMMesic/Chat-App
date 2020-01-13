const socket = io()
let btn = document.querySelector('#button')
let input = document.querySelector('input')
let form = document.querySelector('#message-form')
let locationBtn = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

locationBtn.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    const sendLocation = navigator.geolocation.getCurrentPosition((position) => {  
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })

})
