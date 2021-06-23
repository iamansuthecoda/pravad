function isEven(num){
    num = parseInt(num);
    if (num % 2 == 1)
        return false;
    else
        return true;
}

function generateBinary(dec){
    dec = dec.toString() || "";
    let result = "";
    for (let i=0; i<dec.length; i++){
        result += (parseInt(dec.charAt(i)) >>> 0).toString(2);
    }
    result = result.toString();
    return result;
}

function generateNumber(str){
    str = str.toString() || "";
    let result = "";
    for (let i=0; i<str.length; i++){
        result += str.charCodeAt(i);
    }
    result = result.toString();
    return result;
}

function encrypt(plTxt, pass){
    plTxt = plTxt || "";
    plTxt.toString();
    pass = pass || "";
    let key = generateBinary(generateNumber(pass.toString())).toString();
    let forward;
    let forbackDec = 0;
    let shift = 0;
    let result = "";
    for (let i=0; i<key.length; i++){
        let bool = Boolean(parseInt(key.charAt(i)));
        if (bool)
            shift++;
        else
            forbackDec++;
    }
    forward = isEven(forbackDec);
    for (let i=0; i<plTxt.length; i++){
        if (forward){
            if (result != "") {
                result += "." + (plTxt.charCodeAt(i) + shift).toString();
            } else {
                result += (plTxt.charCodeAt(i) + shift).toString();
            }
        } else {
            if (result != "") {
                result += ("." + (plTxt.charCodeAt(i) - shift)).toString();
            } else {
                result += (plTxt.charCodeAt(i) - shift).toString();
            }
        }
    }
    result = result.toString();
    return result;
}

function decrypt(ciTxt, pass){
    ciTxt = ciTxt || "";
    ciTxt.toString();
    pass = pass || "";
    let key = generateBinary(generateNumber(pass.toString())).toString();
    let forward;
    let forbackDec = 0;
    let shift = 0;
    let result = "";
    let ciArr = ciTxt.split(".");
    for (let i=0; i<key.length; i++){
        let bool = Boolean(parseInt(key.charAt(i)));
        if (bool)
            shift++;
        else
            forbackDec++;
    }
    forward = !(isEven(forbackDec));
    ciArr.forEach((ciEle) => {
        if (forward){
            result += String.fromCharCode(parseInt(ciEle) + shift);
        } else {
            result += String.fromCharCode(parseInt(ciEle) - shift);
        }
    });
    result = result.toString();
    return result;
}