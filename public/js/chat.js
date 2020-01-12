const socket = io()
let btn = document.querySelector('#button')
let input = document.querySelector('input')
let form = document.querySelector('#message-form')

socket.on('message', (message) => {
    console.log(message)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.value
    socket.emit('sendMessage', message)
})
