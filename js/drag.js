function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(event) {
        event = event ?? window.event;
        event.preventDefault();
        pos3 = event.clientX;
        pos4 = event.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(event) {
        event = event ?? window.event;
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;
        if (((elmnt.offsetTop - pos2) > 0) && ((elmnt.offsetTop - pos2) < (innerHeight - elmnt.clientHeight))){
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        }
        if (((elmnt.offsetLeft - pos1) > 0) && ((elmnt.offsetLeft - pos1) < (innerWidth - elmnt.clientWidth))){
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px"
        }
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function toggleEleDisp(elmnt) {
    if (elmnt.style.display == "block") {
        elmnt.style.display = "none";
    } else {
        elmnt.style.display = "block";
    }
}

function toggleScreenView(elmnt){
    elmnt.style.top = "0px";
    elmnt.style.left = "0px";
    elmnt.classList.toggle('screenview');
}

dragElement(document.getElementById("participants"));