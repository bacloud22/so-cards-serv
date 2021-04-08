var options = {
    classname: "toast",
    transition: "fade",
    insertBefore: true,
    duration: 4000,
    enableSounds: true,
    autoClose: false,
    progressBar: true,
    sounds: {
        info: "../sounds/info/1.mp3",
        success: "../sounds/success/1.mp3",
        warning: "../sounds/warning/1.mp3",
        error: "../sounds/error/1.mp3",
    },

    onShow: function (type) { },

    onHide: function (type) { },

    prependTo: document.body.childNodes[0]
};

var toast = new Toasty(options);


String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return "" + hash;
};

// A verified version of btoa
function btoaVerified(s) {
    return btoa(s) + "@" + btoa(s).hashCode()
}

const domain = "/c?"

const version = 1
var shortestString
// When necessary create a new implementation for URL codification.
// Anyway, it must be of form /card.html?{.*}|/d
function codify(formJSON) {
    switch (version) {
        case 0:
            shortestString = /*domain +*/ Object.values(formJSON).join(",")
            return domain + btoa(shortestString) + `|${version}`   // version 0 
        case 1:
            shortestString = /*domain +*/ Object.values(formJSON).join(",")
            return domain + btoaVerified(shortestString) + `%${version}`    // version 1 
        default:
            break;
    }
}
var formData
// Manipulate dom on form submit
function handleFormSubmit(event) {
    event.preventDefault();
    formData = new FormData(event.target);
    differForConn()
}
// Attach handleFormSubmit
const form = document.querySelector('.contact-form');
form.addEventListener('submit', handleFormSubmit);

// Language selector.
function langChange(el) {
    document.body.setAttribute('lang', el.value);
}

function copyLink() {
    /* Get the text field */
    var copyText = document.getElementById("to_copy");
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
}
var currentId;
var counter = 0;
var matchingCounter = 0;
function handleDom() {
    // for multi-selects, we need special handling
    const formJSON = Object.fromEntries(formData.entries());
    const encodedString = codify(formJSON)
    _id = (Math.random().toString(36).substr(4))
    currentId = _id
    // mcastUrl = "https://demo.httprelay.io/mcast/" + _id
    const hotLink = encodedString + '===' + _id
    console.log(hotLink)
    var sock = new SockJS('https://so-c.herokuapp.com/echo');
    sock.onopen = function () {
        console.log('open');
        sock.send(_id);
    };
    sock.onmessage = function (e) {
        console.log('message got from: ', e.data);
        if (e.data === currentId && (counter++ > 0)) {
            matchingCounter++
            var htmlCounter = document.getElementById("counter");
            htmlCounter.innerHTML = "Number of visitors of your card: " + matchingCounter
            console.log("A new follower is landing")
            toast.success("A new follower is landing")
        }
        // sock.close();
    };
    sock.onclose = function () {
        console.log('close');
    };
    // const simpleURL = new URLSearchParams(formJSON).toString()
    try {
        new QRCode(document.getElementById("qrcode"), hotLink);
        var canvas = document.getElementById('qrcode').querySelector('canvas');
        var dataURL = canvas.toDataURL();
        document.querySelector('#link').insertAdjacentHTML('beforeend', "<br><a download='my_qr_code.png' href='" + dataURL + "'>Download QR code</a> | ");
    } catch (error) {
        toast.error("Sorry, there was a problem generating the QR code. It is probably due to a lot of information you entered.");
    }

    var a = document.createElement('a');
    var linkText = document.createTextNode("Share my link");
    a.appendChild(linkText);
    a.title = "My link";
    a.href = hotLink;
    document.querySelector('#link').appendChild(a);
    document.querySelector('#link').insertAdjacentHTML('beforeend', "<br><div style='display:flex'><input type='text' value='" + hotLink + "' id='to_copy' readonly><i class='fa fa-copy icon' onclick='copyLink()'></i></div>");
    // this show an informational message:
    toast.info("Here you get live notifications when anyone is landing on your card! When you close you lose track on them.");
}


function differForConn() {
    setTimeout(
        function () {
            handleDom();
            // subscribe();
        }, 1000);
}
var _id;
var mcastUrl;