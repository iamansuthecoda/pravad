//Microphone msg
//Define startMicBtn and stopMicBtn
function getMicAudio(){
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({audio:true, video:false}).then((mediaStream) => {
            let mediaRecorder = new MediaRecorder(mediaStream);
            let chunks = [];
            mediaRecorder.start();
            startMicBtn.style.display = 'none';
            stopMicBtn.style.display = 'block';
            stopMicBtn.addEventListener('click', ()=> {
                mediaRecorder.stop();
                stopMicBtn.style.display = 'none';
                startMicBtn.style.display = 'block';
            })
            mediaRecorder.ondataavailable = function(e){
                chunks.push(e.data);
            }
            mediaRecorder.onstop = function(e){
                let blob = new Blob(chunks, {type: 'audio/wav'});
                chunks = [];
                var reader = new FileReader();
                reader.readAsDataURL(blob); 
                reader.onloadend = function() {
                    resolve(reader.result);
                }
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

function appendMicAudio(base64Str, alignment, sname){
    alignment = alignment ?? 'C';
    sname = sname ?? "SomeOne";

    let audio = new Audio(base64Str);
    audio.addEventListener('play', () => { img.src = "./../svg/pause.svg"; });
    audio.addEventListener('pause', () => { img.src = "./../svg/play.svg"; });

    let msgBox = document.createElement('div');
    msgBox.classList.add('txt-message-container');
    let img = document.createElement('img');
    img.src = "./../svg/play.svg";
    img.classList.add('micAudio');
    img.addEventListener('click', () => {
        if (audio.paused)
        audio.play();
        else
        audio.pause();
    });

    switch(alignment.toUpperCase().charAt()){
        case 'L':
            msgBox.style.justifyContent = 'space-between';
            msgBox.classList.add('micAudio-sender');
            let span = document.createElement('span');
            span.textContent = sname;
            span.style.margin = "0 1vmin";
            msgBox.appendChild(span);
            break;
        case 'R':
            msgBox.style.justifyContent = 'end';
            break;
        default:
            msgBox.style.justifyContent = 'center';
            break;
    }
    
    msgBox.appendChild(img);
    incMsgContainer.appendChild(msgBox);
}

//Audio
async function audToBase64(file){
    return new Promise ((resolve, reject) => {
        let type = file.type.split('/')[0];
        if (type == 'audio'){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
        } else {
            reject("The file is not an audio\nFileType: " + type);
        }
    })
}

//Image
async function imgToBase64(file){
    return new Promise ((resolve, reject) => {
        let type = file.type.split('/')[0];
        if (type == 'image'){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
        } else {
            reject("The file is not an image\nFileType: " + type);
        }
    })
}

//Video
async function vidToBase64(file){
    return new Promise ((resolve, reject) => {
        let type = file.type.split('/')[0];
        if (type == 'video'){
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
        } else {
            reject("The file is not an video\nFileType: " + type);
        }
    })
}