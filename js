"use strict";

const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const message =
    document.getElementById("message");

const resetButton =
    document.getElementById("resetButton");


const WIDTH = 430;
const HEIGHT = 780;


// -----------------------------
// GAME STATE
// -----------------------------

let game = {
    pinPulled: false,

    waterParticles: [],

    time: 0,

    levelComplete: false,

    fish: {
        x: 215,
        y: 680
    }
};


// -----------------------------
// RESET
// -----------------------------

function resetGame() {

    game = {
        pinPulled: false,

        waterParticles: [],

        time: 0,

        levelComplete: false,

        fish: {
            x: 215,
            y: 680
        }
    };

    message.textContent =
        "Pull the pin to release the water.";

    draw();
}


// -----------------------------
// ROUNDED RECTANGLE
// -----------------------------

function roundedRect(
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke,
    lineWidth = 1
) {

    ctx.beginPath();

    ctx.moveTo(
        x + radius,
        y
    );

    ctx.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        radius
    );

    ctx.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        radius
    );

    ctx.arcTo(
        x,
        y + height,
        x,
        y,
        radius
    );

    ctx.arcTo(
        x,
        y,
        x + width,
        y,
        radius
    );

    ctx.closePath();


    if (fill) {

        ctx.fillStyle = fill;

        ctx.fill();
    }


    if (stroke) {

        ctx.lineWidth = lineWidth;

        ctx.strokeStyle = stroke;

        ctx.stroke();
    }
}


// -----------------------------
// BACKGROUND
// -----------------------------

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    gradient.addColorStop(
        0,
        "#16d5e5"
    );

    gradient.addColorStop(
        1,
        "#58e2ed"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Background curves

    ctx.strokeStyle =
        "rgba(0,120,150,0.12)";

    ctx.lineWidth = 2;


    for (
        let i = -1;
        i < 7;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            30 + i * 78,
            100
        );

        ctx.bezierCurveTo(
            -20 + i * 78,
            300,

            95 + i * 78,
            420,

            25 + i * 78,
            720
        );

        ctx.stroke();
    }


    // Bubbles

    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const x =
            (i * 79) % 410 + 10;

        const y =
            130 + ((i * 137) % 590);


        ctx.fillStyle =
            "rgba(255,255,255,0.13)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            4 + (i % 4) * 2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// -----------------------------
// TOP UI
// -----------------------------

function drawHeader() {

    // Gear

    ctx.beginPath();

    ctx.arc(
        58,
        70,
        36,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,255,255,0.05)";

    ctx.fill();

    ctx.lineWidth = 5;

    ctx.strokeStyle = "white";

    ctx.stroke();


    ctx.fillStyle = "white";

    ctx.font = "31px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(
        "⚙",
        58,
        70
    );


    // Tool button

    ctx.beginPath();

    ctx.arc(
        151,
        70,
        36,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#22c96d";

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.stroke();


    ctx.fillStyle = "white";

    ctx.font = "27px Arial";

    ctx.fillText(
        "🔨",
        151,
        70
    );


    // Level

    roundedRect(
        168,
        35,
        170,
        70,
        15,
        "#69c80b"
    );


    ctx.fillStyle = "white";

    ctx.font =
        "900 31px Arial";

    ctx.fillText(
        "LEVEL 1",
        253,
        70
    );


    // Skip

    ctx.beginPath();

    ctx.arc(
        360,
        70,
        36,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#258de9";

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 5;

    ctx.stroke();


    ctx.fillStyle =
        "white";

    ctx.font =
        "900 17px Arial";

    ctx.fillText(
        "SKIP",
        360,
        61
    );


    ctx.font =
        "19px Arial";

    ctx.fillText(
        "▶",
        360,
        83
    );


    // Reset icon

    ctx.beginPath();

    ctx.arc(
        415,
        70,
        36,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#f5b716";

    ctx.fill();

    ctx.strokeStyle =
        "white";

    ctx.stroke();


    ctx.fillStyle =
        "white";

    ctx.font =
        "33px Arial";

    ctx.fillText(
        "↻",
        415,
        70
    );
}


// -----------------------------
// CAVE
// -----------------------------

function drawCave() {

    // Dark tunnel

    ctx.fillStyle =
        "#102a37";


    ctx.beginPath();

    ctx.moveTo(
        133,
        0
    );

    ctx.lineTo(
        351,
        0
    );

    ctx.lineTo(
        351,
        323
    );


    ctx.bezierCurveTo(
        351,
        338,
        389,
        350,
        392,
        382
    );


    ctx.lineTo(
        418,
        675
    );


    ctx.bezierCurveTo(
        421,
        712,
        402,
        732,
        370,
        740
    );


    ctx.bezierCurveTo(
        300,
        758,
        190,
        755,
        132,
        740
    );


    ctx.bezierCurveTo(
        96,
        731,
        70,
        710,
        73,
        670
    );


    ctx.lineTo(
        91,
        380
    );


    ctx.bezierCurveTo(
        94,
        350,
        133,
        337,
        133,
        323
    );


    ctx.closePath();

    ctx.fill();


    // Ice border

    ctx.strokeStyle =
        "#d3f8f9";

    ctx.lineWidth = 9;


    ctx.beginPath();

    ctx.moveTo(
        133,
        0
    );

    ctx.lineTo(
        133,
        323
    );


    ctx.bezierCurveTo(
        133,
        337,
        94,
        350,
        91,
        380
    );


    ctx.lineTo(
        73,
        670
    );


    ctx.bezierCurveTo(
        70,
        710,
        96,
        731,
        132,
        740
    );


    ctx.bezierCurveTo(
        190,
        755,
        300,
        758,
        370,
        740
    );


    ctx.bezierCurveTo(
        402,
        732,
        421,
        712,
        418,
        675
    );


    ctx.lineTo(
        392,
        382
    );


    ctx.bezierCurveTo(
        389,
        350,
        351,
        338,
        351,
        323
    );


    ctx.lineTo(
        351,
        0
    );


    ctx.stroke();
}


// -----------------------------
// WATER
// -----------------------------

function drawWater() {

    const waterTop =
        game.pinPulled
            ? 300
            : 188;


    ctx.save();


    ctx.beginPath();

    ctx.rect(
        136,
        0,
        214,
        330
    );

    ctx.clip();


    ctx.fillStyle =
        "#3269ee";


    ctx.fillRect(
        136,
        waterTop,
        214,
        330 - waterTop
    );


    // Water surface

    ctx.beginPath();

    ctx.moveTo(
        136,
        waterTop
    );


    for (
        let px = 136;
        px <= 350;
        px += 35
    ) {

        const wave =
            Math.sin(
                px * 0.075 +
                game.time * 0.04
            ) * 4;


        ctx.lineTo(
            px,
            waterTop + wave
        );
    }


    ctx.lineTo(
        350,
        330
    );

    ctx.lineTo(
        136,
        330
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();
}


// -----------------------------
// FLOOR
// -----------------------------

function drawGround() {

    ctx.fillStyle =
        "#6e5923";


    ctx.beginPath();

    ctx.moveTo(
        91,
        681
    );


    ctx.bezierCurveTo(
        132,
        669,
        153,
        687,
        184,
        678
    );


    ctx.bezierCurveTo(
        215,
        668,
        241,
        687,
        274,
        679
    );


    ctx.bezierCurveTo(
        313,
        668,
        344,
        689,
        382,
        678
    );


    ctx.lineTo(
        399,
        720
    );


    ctx.bezierCurveTo(
        320,
        747,
        165,
        748,
        91,
        716
    );


    ctx.closePath();

    ctx.fill();


    // Yellow edge

    ctx.strokeStyle =
        "#b6a52b";

    ctx.lineWidth = 8;


    ctx.beginPath();

    ctx.moveTo(
        93,
        680
    );


    ctx.bezierCurveTo(
        130,
        670,
        150,
        688,
        181,
        679
    );


    ctx.bezierCurveTo(
        215,
        669,
        239,
        687,
        273,
        680
    );


    ctx.bezierCurveTo(
        310,
        670,
        345,
        690,
        383,
        678
    );


    ctx.stroke();
}


// -----------------------------
// FISH
// -----------------------------

function drawFish() {

    const fish =
        game.fish;


    ctx.save();

    ctx.translate(
        fish.x,
        fish.y
    );


    ctx.rotate(
        -0.08
    );


    // Tail

    ctx.fillStyle =
        "#aee85d";

    ctx.strokeStyle =
        "#5a9a40";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.moveTo(
        -27,
        0
    );

    ctx.lineTo(
        -50,
        -17
    );

    ctx.lineTo(
        -45,
        13
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Body

    ctx.fillStyle =
        "#f79426";

    ctx.strokeStyle =
        "#c85b1d";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.ellipse(
        -4,
        0,
        30,
        23,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();


    // Eye

    ctx.fillStyle =
        "white";

    ctx.beginPath();

    ctx.arc(
        10,
        -8,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#111";

    ctx.beginPath();

    ctx.arc(
        13,
        -8,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Fins

    ctx.fillStyle =
        "#b1ea61";


    ctx.beginPath();

    ctx.moveTo(
        0,
        -17
    );

    ctx.lineTo(
        10,
        -34
    );

    ctx.lineTo(
        18,
        -12
    );

    ctx.closePath();

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(
        3,
        17
    );

    ctx.lineTo(
        15,
        31
    );

    ctx.lineTo(
        22,
        13
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();
}


// -----------------------------
// PIN
// -----------------------------

function drawPin() {

    if (game.pinPulled)
        return;


    const y = 333;

    const start = 75;

    const end = 355;


    ctx.save();

    ctx.lineCap =
        "round";


    // Dark outline

    ctx.strokeStyle =
        "#783b12";

    ctx.lineWidth = 18;


    ctx.beginPath();

    ctx.moveTo(
        start,
        y
    );

    ctx.lineTo(
        end,
        y
    );

    ctx.stroke();


    // Gold pin

    ctx.strokeStyle =
        "#ffb449";

    ctx.lineWidth = 12;


    ctx.beginPath();

    ctx.moveTo(
        start,
        y
    );

    ctx.lineTo(
        end,
        y
    );

    ctx.stroke();


    // Handle

    ctx.fillStyle =
        "#ffb63d";

    ctx.strokeStyle =
        "#8a4814";

    ctx.lineWidth = 6;


    ctx.beginPath();

    ctx.arc(
        end,
        y,
        28,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();


    ctx.strokeStyle =
        "#ffe178";

    ctx.lineWidth = 5;


    ctx.beginPath();

    ctx.arc(
        end,
        y,
        17,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // Left stopper

    roundedRect(
        77,
        y - 18,
        25,
        36,
        7,
        "#ffb848",
        "#814211",
        4
    );


    ctx.restore();
}


// -----------------------------
// WATER PARTICLES
// -----------------------------

function createWater() {

    game.waterParticles = [];


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        game.waterParticles.push({

            x:
                145 +
                Math.random() * 195,

            y:
                335 +
                Math.random() * 15,

            speed:
                1 +
                Math.random() * 2,

            radius:
                2 +
                Math.random() * 3
        });
    }
}


function updateWater() {

    if (!game.pinPulled)
        return;


    for (
        const particle
        of game.waterParticles
    ) {

        particle.y +=
            particle.speed;


        // Keep water inside the shaft.

        if (
            particle.y >
            665
        ) {

            particle.y =
                665;
        }
    }
}


function drawWaterParticles() {

    ctx.fillStyle =
        "rgba(75,150,255,0.9)";


    for (
        const particle
        of game.waterParticles
    ) {

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// -----------------------------
// PULL PIN
// -----------------------------

function pullPin() {

    if (game.pinPulled)
        return;


    game.pinPulled =
        true;


    createWater();


    message.textContent =
        "Water released! 🐠";
}


// -----------------------------
// INPUT
// -----------------------------

let dragging = false;


canvas.addEventListener(
    "pointerdown",
    function(event) {

        const rect =
            canvas.getBoundingClientRect();


        const x =
            (event.clientX -
                rect.left)
            *
            WIDTH /
            rect.width;


        const y =
            (event.clientY -
                rect.top)
            *
            HEIGHT /
            rect.height;


        const distance =
            Math.hypot(
                x - 355,
                y - 333
            );


        if (
            distance < 50 &&
            !game.pinPulled
        ) {

            dragging = true;

            canvas.setPointerCapture(
                event.pointerId
            );
        }
    }
);


canvas.addEventListener(
    "pointermove",
    function(event) {

        if (!dragging)
            return;


        const rect =
            canvas.getBoundingClientRect();


        const x =
            (event.clientX -
                rect.left)
            *
            WIDTH /
            rect.width;


        if (x > 390) {

            pullPin();

            dragging = false;
        }
    }
);


canvas.addEventListener(
    "pointerup",
    function() {

        dragging = false;
    }
);


canvas.addEventListener(
    "pointercancel",
    function() {

        dragging = false;
    }
);


// -----------------------------
// RESET BUTTON
// -----------------------------

resetButton.addEventListener(
    "click",
    resetGame
);


// -----------------------------
// GAME LOOP
// -----------------------------

function update() {

    game.time++;

    updateWater();
}


function draw() {

    drawBackground();

    drawHeader();

    drawCave();

    drawWater();

    drawWaterParticles();

    drawGround();

    drawFish();

    drawPin();
}


function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}


resetGame();

gameLoop();

})();