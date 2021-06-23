const linkEle = document.getElementById("joinlink")
const modal = document.getElementById("myModal");
const closeBtn = document.getElementById("closeModal");
const shareBtn = document.getElementById('share');

const inviteLink = `${location.protocol}//${location.host}${location.pathname}?pwd=${pass}`;
linkEle.innerHTML = inviteLink;

shareBtn.onclick = function() {
    modal.style.display = "block";
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function copyToClipboard() {
    navigator.clipboard.writeText(inviteLink);
}

function shareOnWhatsApp() {
    window.open(encodeURI("https://wa.me/?text=Hey Pal!\nCheck this online messenger *Pravad*\nClick the link below to chat now\n\n" + inviteLink))
}