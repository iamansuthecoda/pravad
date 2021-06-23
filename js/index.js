const socket = io('https://pravad.herokuapp.com');

//loading DOM elements
const hamburger = document.querySelector('.hamburger');
const navlinks = document.querySelector('.nav-links');
const navlink = document.querySelectorAll('.nav-links li');
const shareBtn = document.getElementById('share');
const userPane = document.getElementById('left-pane');
const namelist = document.getElementById('activeUsers');
var incMsgContainer, sendBtn,  messageInput, startMicBtn, stopMicBtn;

//assigning initial values
var allUsers = [];
var uname = null, pass = null;
const usp = new URLSearchParams(location.search);
const urlName = usp.get("name");
const urlPwd = usp.get("pwd");

hamburger.addEventListener('click', () => {
	navlinks.classList.toggle('open');
	navlink.forEach((link) => {
		link.classList.toggle('fade');
		link.addEventListener('click', () => {
			navlinks.classList.remove('open');
			navlink.forEach((li) => {
				li.classList.remove('fade');
			});
		});
	});
});

function showSection(section){
    section = section ?? 0;
    sections = ["home", "group", "private", "settings"];
    mainContainer = document.querySelector('main');
    for (i=0; i<sections.length; i++){
        let child = mainContainer.children[i];
        child.style.display = 'none';
    }
    mainContainer.children[section].style.display = 'block';
    if (section == 1){
        shareBtn.style.display = 'block';
        incMsgContainer = document.getElementById('grpMsgBox');
        messageInput = document.getElementById('grpMsg');
        startMicBtn = document.getElementById('grpMicStart');
        stopMicBtn = document.getElementById('grpMicStop');
        sendBtn = document.getElementById('grpSend');
		initChat('grp');
    } else if (section == 2){
        shareBtn.style.display = 'block';
        incMsgContainer = document.getElementById('priIncMsgs');
        messageInput = document.getElementById('priIncMsgs');
        startMicBtn = document.getElementById('priMicStop');
        stopMicBtn = document.getElementById('priMicStop');
        sendBtn = document.getElementById('priIncMsgs');
		initChat('pri');
    } else
        shareBtn.style.display = 'none';
}
showSection();

if (urlName	!=	null || urlName	!=	undefined)	uname = urlName;
if (urlPwd	!=	null || urlPwd	!=	undefined)	pass = urlPwd;
if (uname	==	null || uname	==	undefined)	uname = prompt('What is your name?');
if (pass	==	null || pass	==	undefined)	pass = prompt('Please enter a passcode\nMinimum 8 digits preferred');

function initChat(){
	messageInput.focus();
	appendMessage('You joined')
	socket.emit('new-user', uname)

	socket.on('chat-message', (data) => {
		var tempmsg = decrypt(`${data.message}`, pass);
		if (tempmsg != "" || tempmsg != null || tempmsg != undefined)
			appendMessageL(`${data.name}: ` + decrypt(`${data.message}`, pass))
		else
			appendMessageL(`${data.name} is trying to send a message but his/her passcode isn't the same as yours`)
	})

	socket.on('chat-voice', (data) => {
		console.log(data);
	})

	socket.on('user-connected', (name) => {
		appendMessage(`${name} connected`)
	})

	socket.on('allUsers', users => {
		allUsers = users;
		appendUsers(allUsers);
	});

	socket.on('user-disconnected', (name) => {
		namelist.style.color = 'red'
		appendMessage(`${name} disconnected`)
	});

	socket.on('connect', () => {
		appendMessage("You got connected!");
		socket.emit('req-users');
		socket.on('rec-users', (users) => {
			appendUsers(users);
		})
	})

	socket.on('disconnect', () => {
		appendMessage("You got disconnected :(");
		appendMessage("Reload this page to reconnect")
	});

	messageInput.addEventListener('keypress', (e) => {
		if (e.pass == "Enter") sendBtn.click()
	});

	startMicBtn.addEventListener('click', () => {
		getMicAudio().then((result) => {
			console.log(result);//make changes here
		}).catch((err) => {
			console.log(err.name + ": " + err.message);
		});
	});

	sendBtn.addEventListener('click', e => {
		e.preventDefault()
		const message = encrypt(messageInput.value, pass)
		if (message != "" || message != null || message != undefined) {
			appendMessageR(messageInput.value)
			socket.emit('send-chat-message', message)
			messageInput.value = ''
		}
		messageInput.focus();
	})

	window.addEventListener('keypress', (e) => {
		if (e.pass == '/') {
			e.preventDefault();
			messageInput.focus();
		}
	});
}

function appendMessage(message) {
	const messageElement = document.createElement('div')
	messageElement.style.display = 'flex';
	messageElement.style.justifyContent = 'center';
	messageElement.innerText = message
	incMsgContainer.append(messageElement)
}

function appendMessageL(message) {
	const messageElement = document.createElement('div')
	messageElement.style.display = 'flex';
	messageElement.style.justifyContent = 'flex-start';
	messageElement.style.paddingLeft = '10px';
	messageElement.innerText = message
	incMsgContainer.append(messageElement)
}

function appendMessageR(message) {
	const messageElement = document.createElement('div')
	messageElement.style.display = 'flex';
	messageElement.style.justifyContent = 'flex-end';
	messageElement.style.paddingRight = '10px';
	messageElement.innerText = message
	incMsgContainer.append(messageElement)
}

function appendUsers(arr) {
	namelist.innerHTML = null;
	arr.forEach(user => {
		if (user){
			li = document.createElement('li');
			li.innerText = user.name;
			li.setAttribute('data-id', user.id);
			namelist.append(li);
		}
	});
}