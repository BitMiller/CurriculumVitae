
function pad(num, size) {
    return ("0000" + num).substr(-size);
}

const cv_text = at250413_Gall_Peter_CV_EN_BP_INF;

var e_textContainer = document.getElementById("textContainer");
var letters = new Array();

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration


for (let i=0; i<cv_text.length; i++) {
    for (let j=0; j<cv_text[i].length; j++) {
        let letter_id_string = "letter_" + pad(i, 3) + "_" + pad(j, 3);

        let span = document.createElement("span");
        span.setAttribute("id", letter_id_string);
        span.textContent = cv_text[i][j];

        e_textContainer.appendChild(span);
        letters.push(document.getElementById(letter_id_string));

        let rect = span.getBoundingClientRect();
        span.dataset.homeX = rect.left+window.scrollX;
        span.dataset.homeY = rect.top+window.scrollY;
        span.dataset.sleep = "1";
    }
    e_textContainer.appendChild(document.createElement("br"));
}


// https://stackoverflow.com/questions/7790725/javascript-track-mouse-position

document.onmousemove = handleMouseMove;

function handleMouseMove(event) {
    let mx = event.pageX;
    let my = event.pageY;

    for (let i = 0; i < letters.length;i++) {
        let lx = letters[i].dataset.homeX;
        let ly = letters[i].dataset.homeY;
        let dx = mx - lx;
        let dy = my - ly;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 20) {
            letters[i].style.color = "red";
            letters[i].style.transform = "translate(3px, 3px)"; // needs "display: inline-block;" set in CSS to work! span's default inline makes it non-working
            letters[i].dataset.sleep = "0";
        }
        else if (letters[i].dataset.sleep == "0") {
            letters[i].style.color = "black";
            letters[i].style.transform = "translate(0)";
            letters[i].dataset.sleep = "1";
        }
    }
}

