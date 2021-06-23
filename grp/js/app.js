/*Socket endpoints:
|-In:
|   |- usersList() -> Users
|   |- chatMessageTxt() -> {name, msg}
|   |- chatMessageVoice() -> {name, aud}
|   |- userDisconnected() -> user.name
|-Out:
|   |- newUser(name)
|   |- reqUsersList() -> Users[]
|   |- msgTxtGrp() -> msg
|   |- msgVoiceGrp() -> aud
*/
const socket = io('https://pravad.herokuapp.com');//io('http://localhost:8081');
//const db = new Localbase('db');

//loading DOM elements
const incMsgContainer = document.getElementById('grpMsgBox');
const messageInput = document.getElementById('grpMsg');
const fileDOM = document.getElementById('grpFile');
const startMicBtn = document.getElementById('grpMicStart');
const stopMicBtn = document.getElementById('grpMicStop');
const sendBtn = document.getElementById('grpSend');

//assigning initial values
/*var userSettings = {
    theme: 'light',
    name: 'User',
    pass: '0'
};*/
var allUsers = [];
var uname = null, pass = null;
const themeColor = getComputedStyle(document.documentElement).getPropertyValue('--theme');
const usp = new URLSearchParams(location.search);
const urlName = usp.get("name");
const urlPwd = usp.get("pwd");
if (urlName	!=	null || urlName	!=	undefined)	uname = urlName;
if (urlPwd	!=	null || urlPwd	!=	undefined)	pass = urlPwd;
if (uname	==	null || uname	==	undefined)	uname = prompt('What is your name?');
if (pass	==	null || pass	==	undefined)	pass = prompt('Please enter a passcode\nMinimum 8 digits preferred');


document.querySelectorAll('img').forEach((img) => {
    //img.ondragstart = () => { return false };
    img.addEventListener('dragstart', event => event.preventDefault());
    img.addEventListener('contextmenu', event => event.preventDefault());
});
messageInput.focus();
socket.emit('newUser', {name: encrypt(uname, pass), key: encrypt(pass, pass)});

window.addEventListener('keypress', (e) => {
    if (e.key == '/') {
        e.preventDefault();
        messageInput.focus();
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key == "Enter") sendBtn.click();
});

startMicBtn.addEventListener('click', (e) => {
    e.preventDefault();
    getMicAudio().then((result) => {
        const audio = encrypt(result, pass);
        if (audio != "" || audio != null || audio != undefined) {
            appendMicAudio(result, 'R');
            socket.emit("msgVoiceGrp", LZString.compress(audio));
        }
        delete audio;
    }).catch((err) => {
        console.log(err.name + ": " + err.message);
    });
});

/*fileDOM.addEventListener('change', async () => {
    for (let i = 0; i < fileDOM.files.length; i++) {
        const file = fileDOM.files[i];
        let base64Str;
        if (file.type.split("/")[0] == "image")
            base64Str = await imgToBase64(file);
        else if (file.type.split("/")[0] == "video")
            base64Str = await vidToBase64(file);
        else if (file.type.split("/")[0] == "audio")
            base64Str = await audToBase64(file);
        else {
            alert("We support only image, audio and video file types");
            break;
        }
        const fileEnc = encrypt(base64Str, pass);
        if (fileEnc != "" || fileEnc != null || fileEnc != undefined) {
            socket.emit("msgVoiceGrp", fileEnc);
        }
        delete fileEnc;
    }
});*/

sendBtn.addEventListener('click', e => {
    e.preventDefault();
    const message = encrypt(messageInput.value, pass)
    if (message != "" || message != null || message != undefined) {
        appendMessage(messageInput.value, 'R', false);
        socket.emit("msgTxtGrp", message);
        messageInput.value = '';
    }
    delete message;
    messageInput.focus();
});

socket.on('connect', () => {
    sysMsg("You Got CONNECTED!", false);
    socket.emit("reqUsersList");
    /*db.collection('settings').limit(1).get().then((settings) => {
        if (settings.length != 0 && settings != undefined && settings != null){
            userSettings = settings[0];
            socket.id = userSettings.id;
        } else {
            userSettings.id = socket.id;
            db.collection('settings').delete();
            db.collection('settings').add(userSettings);
        }
        if (userSettings.id == undefined){
            userSettings.id = socket.id;
            db.collection('settings').doc({ id: undefined }).update({ id: socket.id });
        }
    });*/
});

socket.on('user-connected', (user) => {
    sysMsg(`${decrypt(user, pass)} connected`, false)
}); 

socket.on('userDisconnected', (user) => {
    sysMsg(`${decrypt(user, pass)} Disconnected`, true);
});

socket.on("usersList", (users) => {
    allUsers = users;
    allUsers.forEach((user) => {
        if (decrypt(user.key, pass) == pass)
            console.log(`${decrypt(user.name, pass)} : ${user.id} : Encryption Success`);
    });
});

socket.on('chatMessageTxt', (data) => {
    appendMessage(`${data.name}: ${decrypt(data.message, pass)}`, 'L');
});

socket.on('chatMessageVoice', (data) => {
    data.audio = LZString.decompress(data.audio);
    appendMicAudio(decrypt(data.audio, pass), 'L', data.name);
});

socket.on('disconnect', () => {
    sysMsg("You got disconnected :(", true);
    sysMsg("Reconnecting...", true);
});

function appendMessage(message, alignment, system) {
    if (message == null || message == undefined || message == "")
        message = "No message was sent\n<BLANK_MSG>";
    alignment = alignment ?? "C";
    system = system ?? false;

    if (typeof alignment == "boolean"){
        system = alignment;
        alignment = "C";
    }

	let msgBox = document.createElement('div');
    msgBox.classList.add('txt-message-container');
    switch(alignment.toUpperCase().charAt()){
        case 'L':
            msgBox.style.justifyContent = 'start';
            break;
        case 'R':
            msgBox.style.justifyContent = 'end';
            break;
        default:
            msgBox.style.justifyContent = 'center';
            break;
    }

	let msgEle = document.createElement('span');
    msgEle.classList.add('txt-message')
    msgEle.textContent = message;

    if (system){
        msgEle.textContent = "SYSTEM: " + message.toUpperCase();
        msgEle.style.backgroundColor = "#000000";
        msgBox.style.color = '#ffffff';
    }

    msgBox.appendChild(msgEle)
	incMsgContainer.appendChild(msgBox);
}

function sysMsg(message, err){
    err = err ?? false;
    let msgBox = document.createElement('div');
    msgBox.classList.add('txt-message-container');

    let msgEle = document.createElement('span');
    msgEle.classList.add('txt-message');
    msgEle.textContent = message;   
    msgEle.style.color = '#ffffff';
    msgEle.style.fontWeight = "700";
    msgEle.style.backgroundColor = err ? "#ff0000" : "#00ff00";

    msgBox.appendChild(msgEle)
	incMsgContainer.appendChild(msgBox);
}

function switchTheme(theme){
    theme = theme ?? "Dark";
    theme = theme.toUpperCase().charAt();
    switch (theme) {
        case 'L':{
            document.querySelector('')
        }   break;
        case 'D':{

        }   break;
        default:
            switchTheme('L');
            break;
    }
}