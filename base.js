// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration
// https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// https://www.freecodecamp.org/news/innerhtml-vs-innertext-vs-textcontent/#heading-what-is-the-textcontent-property

function pad(num, size) {
    return ("0000" + num).substr(-size);
}

const cv_text = at250413_Gall_Peter_CV_EN_BP_INF;
const effectDistance = 20;
const protectedChars = new Array(" ", "\"", "'", "\\", "/", "|", ",", ":", ".", ";", "{", "}", "[", "]", "(", ")");
const translateX = "1px";
const translateY = "1px";
const defaultStyleClass = "s08";

var e_textContainer = document.getElementById("textContainer");
var letters = new Array();
var minPosX = 0;
var minPosY = 0;
var maxPosX = 0;
var maxPosY = 0;
var firingPixels = new Array();
var currentStyleClass = defaultStyleClass;
var hyperLink = "";

eraseContainer();
populateContainer();
startFadeInAnimation();

document.onmousemove = handleMouseMove;

function eraseContainer() {
    e_textContainer.innerHTML = "";
}

function populateContainer() {
    for (let i = 0; i < cv_text.length; i++) {
        currentStyleClass = defaultStyleClass;

        for (let j = 0; j < cv_text[i].length; j++) {
            if (cv_text[i][j] == "$") {
                hyperLink = "";
                currentStyleClass = "s" + cv_text[i][j+2] + cv_text[i][j+3];

                if (cv_text[i][j+4] == "|") {
                    let k = 0;

                    while (cv_text[i][j+5+k] != "]") {
                        hyperLink += cv_text[i][j+5+k];
                        k++;
                    }
                    j += hyperLink.length+1;
                }
                j += 4;
            }
            else {
                let letter_id_string = "letter_" + pad(i, 3) + "_" + pad(j, 3);

                let charSpan = document.createElement("span");
                charSpan.setAttribute("id", letter_id_string);
                charSpan.classList.add(currentStyleClass);

                let placeholderCharSpan = document.createElement("span");
                placeholderCharSpan.classList.add("placeholder");
                placeholderCharSpan.style.display = "inline-block";
                placeholderCharSpan.textContent = " ";

                let binaryCharSpan = document.createElement("span");
                binaryCharSpan.classList.add("binary");
                binaryCharSpan.style.display = "none";
                binaryCharSpan.textContent = "1";

                let realCharSpan = document.createElement("span");
                realCharSpan.classList.add("real");
                realCharSpan.style.display = "none";
                realCharSpan.textContent = cv_text[i][j];

                if (hyperLink != "") {
                    let hyp = document.createElement("a");
                    hyp.href = hyperLink;
                    hyp.target = "_blank";
                    hyp.appendChild(placeholderCharSpan);
                    hyp.appendChild(binaryCharSpan);
                    hyp.appendChild(realCharSpan);
                    charSpan.appendChild(hyp);
                }
                else {
                    charSpan.appendChild(placeholderCharSpan);
                    charSpan.appendChild(binaryCharSpan);
                    charSpan.appendChild(realCharSpan);
                }

                e_textContainer.appendChild(charSpan);
                letters.push(document.getElementById(letter_id_string));

                let rect = charSpan.getBoundingClientRect();
                charSpan.dataset.centerX = (rect.left+rect.right)/2+window.scrollX;
                charSpan.dataset.centerY = (rect.top+rect.bottom)/2+window.scrollY;
                charSpan.dataset.sleep = "1";
                charSpan.dataset.transitionDone = "0";
                //span.style.display = "none";

                if (minPosX > charSpan.dataset.centerX) minPosX = charSpan.dataset.centerX;
                if (minPosY > charSpan.dataset.centerY) minPosY = charSpan.dataset.centerY;
                if (maxPosX < charSpan.dataset.centerX) maxPosX = charSpan.dataset.centerX;
                if (maxPosY < charSpan.dataset.centerY) maxPosY = charSpan.dataset.centerY;
            }
        }
        e_textContainer.appendChild(document.createElement("br"));
    }
/*
    console.log("minPosX :" + minPosX);
    console.log("minPosY :" + minPosY);
    console.log("maxPosX :" + maxPosX);
    console.log("maxPosY :" + maxPosY);
    let bound = letters[0].getBoundingClientRect();
    console.log("char X: " + (bound.right - bound.left)); // 8.8
    console.log("char Y: " + (bound.bottom - bound.top)); // 18.4
*/
}

function random01() {
    return Math.random() > 0.5 ? "0" : "1";
}

function startFadeInAnimation() {
    letters.forEach((chrSpan, i) => {
        setTimeout(() => revealChar(chrSpan), i * 1);
    });
}

function revealChar(chrSpan) {
    let realCh = chrSpan.querySelector(".real");
    let placeholderCh = chrSpan.querySelector(".placeholder");

    if (realCh.innerHTML != " ") {
        let binaryCh = chrSpan.querySelector(".binary");

        let flickerCount = 0;
        const flickerMax = 6 + Math.floor(Math.random() * 4);

        binaryCh.innerHTML = random01();
        placeholderCh.style.display = "none";
        binaryCh.style.display = "inline-block";

        const flicker = setInterval(() => {
            binaryCh.innerHTML = random01();
            flickerCount++;

            if (flickerCount >= flickerMax) {
                binaryCh.style.display = "none";
                realCh.style.display = "inline-block";
                chrSpan.dataset.transitionDone = "1";
                clearInterval(flicker);
            }
        }, 20 + Math.random() * 15);
    }
    else {
        placeholderCh.style.display = "none";
        realCh.style.display = "inline-block";
        chrSpan.dataset.transitionDone = "1";
    }
}

function hideChar() {

}

function handleMouseMove(event) {
    let mx = event.pageX;
    let my = event.pageY;

    for (let i = 0; i < letters.length; i++) {
        if (letters[i].dataset.transitionDone == "1") {
            let realCh = letters[i].querySelector(".real");
            let binaryCh = letters[i].querySelector(".binary");
            let protectedChar = protectedChars.includes(realCh.innerHTML);
            let lx = letters[i].dataset.centerX;
            let ly = letters[i].dataset.centerY;
            let dx = mx - lx;
            let dy = my - ly;
            let dist = Math.sqrt(dx*dx + dy*dy);

            if (letters[i].dataset.sleep == "1" && dist < effectDistance) {
                letters[i].style.transform = "translate(" + translateX + ", " + translateY + ")"; // needs "display: inline-block;" set in CSS to work! span's default inline makes it non-working
                letters[i].dataset.sleep = "0";
                if (!protectedChar) {
                    letters[i].dataset.origColor = letters[i].style.color;
                    letters[i].style.color = "green";
                    binaryCh.innerHTML = random01();
                    binaryCh.style.display = "inline-block";
                    realCh.style.display = "none";
                }
            }
            else if (letters[i].dataset.sleep == "0" && dist >= effectDistance) {
                letters[i].style.transform = "translate(0)";
                letters[i].dataset.sleep = "1";
                if (!protectedChar) {
                    letters[i].style.color = letters[i].dataset.origColor;
                    realCh.style.display = "inline-block";
                    binaryCh.style.display = "none";
                }
            }
        }
    }
}

class Ray {
    constructor(raysLength, raysAngle, pointsX, pointsY) {
        this.raysLength = raysLength;
        this.raysAngle = raysAngle;
        this.pointsX = pointsX;
        this.pointsY = pointsY;
    }
}

function randomRays(rayCount, circleRadius, radiusVariation, angleVariation) {
    let globalAngle = Math.random() * 360;
    let rays = new Array();

    for (let i = 0; i < rayCount; i++) {
        let rayLength = Math.random() * radiusVariation + circleRadius - radiusVariation / 2;
        let rayAngle = (Math.random() * angleVariation + 360 / rayCount * i - angleVariation / 2 + globalAngle + 360) % 360;
        let endX = Math.cos(rayAngle)*rayLength;
        let endY = Math.sin(rayAngle)*rayLength;
        rays.push(new Ray(rayLength, rayAngle, endX, endY));
    }

    return rays;
}



