const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $message = document.querySelector('#message')

//Templates
const messageTemplates = document.querySelector('#message-templete').innerHTML
const locationMessageTemplates = document.querySelector(
  '#location-message-templete'
).innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const autoScroll = () => {
  //New Message Element
  const $newMessage = $message.lastElementChild

  //Height of the new element
  const newMessageStyle = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyle.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  //visible height
  const visibleHeight = $message.offsetHeight

  //Height of the message container
  const containerHeight = $message.scrollHeight

  //how far have i scrolled?
  const scrollOfset = $message.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOfset) {
    $message.scrollTop = $message.scrollHeight
  }
}

socket.on('message', message => {
  console.log(message)

  const html = Mustache.render(messageTemplates, {
    userName: message.userName,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:m  a')
  })

  $message.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('locationMessage', url => {
  console.log(url)
  const html = Mustache.render(locationMessageTemplates, {
    userName: url.userName,
    url: url.text,
    createdAt: moment(url.createdAt).format('h:m  a')
  })

  $message.insertAdjacentHTML('beforeend', html)
  autoScroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', e => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, error => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }

    console.log('Message Delivered!')
  })
})

$sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.')
  }

  $sendLocation.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      () => {
        $sendLocation.removeAttribute('disabled')
        console.log('Location sheared!')
      }
    )
  })
})

socket.emit('join', { username, room }, error => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})

// socket.on('countUpdated', count => {
//   console.log('The Count has been updated', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('Clicked')
//   socket.emit('increment')
// })
