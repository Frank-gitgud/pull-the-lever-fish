"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const resetButton = document.getElementById("resetButton");

const W = 430;
const H = 780;

const state = {
    pinPulled: false,
    dragging: false,

    pinX: 344,
    pinY: 315,
    pinStartX: 344,

    time: 0,
    waterLevel: 184,
    waterFlow: 0,

    fish: {
        x: 215,
        y: 675,
        saved: false
    },

    bubbles: [],
    splash: []
};


// ============================================================
// RESET
// ============================================================

function resetGame() {

    state.pinPulled = false;
    state.dragging = false;

    state.pinX = state.pinStartX;

    state.time = 0;

    state.waterLevel = 184;
    state.waterFlow = 0;

    state.fish.x = 215;
    state.fish.y = 675;
    state.fish.saved = false;

    state.splash = [];

    createBubbles();
}


// ============================================================
// BACKGROUND
// ============================================================

function createBubbles() {

    state.bubbles = [];

    for (let i = 0; i < 30; i++) {

        state.bubbles.push({

            x: 24 + ((i * 137) % 382),

            y:
                125 +
                ((i * 83) % 600),

            radius:
                2 + (i % 4),

            speed:
                0.15 +
                (i % 5) * 0.08,

            phase:
                i * 0.71
        });
    }
}


function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#18c9d7"
    );

    gradient.addColorStop(
        0.55,
        "#20d8df"
    );

    gradient.addColorStop(
        1,
        "#35cdd3"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    // Soft underwater wave patterns.

    ctx.save();

    ctx.globalAlpha = 0.10;

    ctx.strokeStyle = "#087e91";

    ctx.lineWidth = 3;


    for (
        let row = 0;
        row < 7;
        row++
    ) {

        ctx.beginPath();


        for (
            let x = -20;
            x <= W + 20;
            x += 10
        ) {

            const y =
                145 +
                row * 96 +
                Math.sin(
                    x * 0.018 + row
                ) * 8;


            if (x === -20) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }

        ctx.stroke();
    }


    ctx.restore();


    // Background bubbles.

    for (const bubble of state.bubbles) {

        const y =
            bubble.y -
            state.time *
            bubble.speed;

        const wrappedY =
            y < 95
                ? y + 690
                : y;


        const x =
            bubble.x +
            Math.sin(
                state.time * 0.01 +
                bubble.phase
            ) * 5;


        ctx.beginPath();

        ctx.arc(
            x,
            wrappedY,
            bubble.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(255,255,255,0.26)";

        ctx.lineWidth = 1.5;

        ctx.stroke();
    }
}


// ============================================================
// HELPER — ROUNDED RECTANGLE
// ============================================================

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

        ctx.lineWidth =
            lineWidth;

        ctx.strokeStyle =
            stroke;

        ctx.stroke();
    }
}


// ============================================================
// TOP UI
// ============================================================

function drawCircleButton(
    x,
    y,
    radius,
    fill
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = fill;

    ctx.fill();

    ctx.lineWidth = 3;

    ctx.strokeStyle =
        "rgba(255,255,255,0.85)";

    ctx.stroke();
}


function drawTopUI() {

    ctx.save();


    // --------------------------------------------------------
    // Gear
    // --------------------------------------------------------

    drawCircleButton(
        58,
        67,
        35,
        "#19bfcf"
    );


    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.arc(
        58,
        67,
        11,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            4;


        ctx.beginPath();

        ctx.moveTo(
            58 +
            Math.cos(angle) * 13,

            67 +
            Math.sin(angle) * 13
        );

        ctx.lineTo(
            58 +
            Math.cos(angle) * 18,

            67 +
            Math.sin(angle) * 18
        );

        ctx.stroke();
    }


    ctx.fillStyle =
        "white";


    ctx.beginPath();

    ctx.arc(
        58,
        67,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // --------------------------------------------------------
    // Tool
    // --------------------------------------------------------

    drawCircleButton(
        143,
        67,
        35,
        "#39c85e"
    );


    ctx.save();

    ctx.translate(
        143,
        67
    );

    ctx.rotate(
        -0.72
    );


    ctx.strokeStyle =
        "white";

    ctx.lineWidth = 7;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        -10,
        8
    );

    ctx.lineTo(
        9,
        -11
    );

    ctx.stroke();


    ctx.lineWidth = 5;


    ctx.beginPath();

    ctx.moveTo(
        6,
        -14
    );

    ctx.lineTo(
        13,
        -7
    );

    ctx.stroke();


    ctx.restore();


    // --------------------------------------------------------
    // LEVEL
    // --------------------------------------------------------

    roundedRect(
        178,
        35,
        154,
        64,
        16,
        "#73c90c",
        "#baf06d",
        2
    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "900 27px Arial";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.fillText(
        "LEVEL 1",
        255,
        67
    );


    // --------------------------------------------------------
    // SKIP
    // --------------------------------------------------------

    drawCircleButton(
        367,
        67,
        35,
        "#258be5"
    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "900 16px Arial";


    ctx.fillText(
        "SKIP",
        367,
        59
    );


    ctx.font =
        "18px Arial";


    ctx.fillText(
        "▶",
        367,
        79
    );


    // --------------------------------------------------------
    // RESET
    // --------------------------------------------------------

    drawCircleButton(
        418,
        67,
        34,
        "#f2b62b"
    );


    ctx.fillStyle =
        "white";

    ctx.font =
        "30px Arial";


    ctx.fillText(
        "↻",
        418,
        67
    );


    ctx.restore();
}


// ============================================================
// ICE CAVE
// ============================================================

function drawChamber() {

    ctx.save();


    // Dark chamber.

    const chamber =
        new Path2D();


    chamber.moveTo(
        137,
        112
    );

    chamber.lineTo(
        137,
        300
    );


    chamber.bezierCurveTo(
        137,
        326,
        112,
        337,
        105,
        365
    );


    chamber.lineTo(
        83,
        656
    );


    chamber.bezierCurveTo(
        80,
        699,
        99,
        724,
        139,
        735
    );


    chamber.bezierCurveTo(
        193,
        751,
        293,
        751,
        347,
        735
    );


    chamber.bezierCurveTo(
        387,
        724,
        406,
        699,
        403,
        656
    );


    chamber.lineTo(
        381,
        365
    );


    chamber.bezierCurveTo(
        374,
        337,
        349,
        326,
        349,
        300
    );


    chamber.lineTo(
        349,
        112
    );


    chamber.closePath();


    ctx.shadowColor =
        "rgba(0,55,72,0.22)";

    ctx.shadowBlur = 10;

    ctx.shadowOffsetY = 5;


    ctx.fillStyle =
        "#102b39";

    ctx.fill(
        chamber
    );


    ctx.restore();


    // --------------------------------------------------------
    // Ice rim
    // --------------------------------------------------------

    const rim =
        new Path2D();


    rim.moveTo(
        137,
        112
    );

    rim.lineTo(
        137,
        300
    );


    rim.bezierCurveTo(
        137,
        326,
        112,
        337,
        105,
        365
    );


    rim.lineTo(
        83,
        656
    );


    rim.bezierCurveTo(
        80,
        699,
        99,
        724,
        139,
        735
    );


    rim.bezierCurveTo(
        193,
        751,
        293,
        751,
        347,
        735
    );


    rim.bezierCurveTo(
        387,
        724,
        406,
        699,
        403,
        656
    );


    rim.lineTo(
        381,
        365
    );


    rim.bezierCurveTo(
        374,
        337,
        349,
        326,
        349,
        300
    );


    rim.lineTo(
        349,
        112
    );


    ctx.strokeStyle =
        "#d9f7ef";

    ctx.lineWidth = 11;

    ctx.lineJoin =
        "round";

    ctx.stroke(
        rim
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.58)";

    ctx.lineWidth = 3;

    ctx.stroke(
        rim
    );


    // Small ice bumps.

    ctx.fillStyle =
        "#d9f7ef";


    for (
        let x = 106;
        x < 138;
        x += 10
    ) {

        ctx.beginPath();

        ctx.arc(
            x,
            318 +
            Math.sin(x) * 2,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    for (
        let x = 348;
        x < 380;
        x += 10
    ) {

        ctx.beginPath();

        ctx.arc(
            x,
            318 +
            Math.sin(x) * 2,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ============================================================
// WATER
// ============================================================

function drawWave(
    y,
    left,
    right,
    color
) {

    ctx.beginPath();

    ctx.moveTo(
        left,
        y
    );


    for (
        let x = left;
        x <= right;
        x += 12
    ) {

        const wave =
            Math.sin(
                x * 0.055 +
                state.time * 0.045
            ) * 3;


        ctx.lineTo(
            x,
            y + wave
        );
    }


    ctx.lineTo(
        right,
        y + 16
    );

    ctx.lineTo(
        left,
        y + 16
    );


    ctx.closePath();


    ctx.fillStyle =
        color;

    ctx.globalAlpha =
        0.85;

    ctx.fill();

    ctx.globalAlpha =
        1;
}


function drawWater() {

    const top =
        state.pinPulled
            ? Math.min(
                650,
                state.waterLevel +
                state.waterFlow * 4
            )
            : state.waterLevel;


    // Reservoir.

    ctx.save();


    ctx.beginPath();

    ctx.rect(
        141,
        113,
        204,
        198
    );

    ctx.clip();


    const waterGradient =
        ctx.createLinearGradient(
            0,
            top,
            0,
            330
        );


    waterGradient.addColorStop(
        0,
        "#3d86f7"
    );

    waterGradient.addColorStop(
        1,
        "#1f5fe2"
    );


    ctx.fillStyle =
        waterGradient;


    ctx.fillRect(
        141,
        top,
        204,
        330 - top
    );


    drawWave(
        top,
        141,
        345,
        "#55a1ff"
    );


    ctx.restore();


    // Water stream.

    if (state.pinPulled) {

        const streamTop =
            314;


        const streamBottom =
            Math.min(
                655,
                360 +
                state.waterFlow * 4
            );


        const streamGradient =
            ctx.createLinearGradient(
                0,
                streamTop,
                0,
                streamBottom
            );


        streamGradient.addColorStop(
            0,
            "#4e9bff"
        );

        streamGradient.addColorStop(
            1,
            "#236de7"
        );


        ctx.fillStyle =
            streamGradient;


        ctx.fillRect(
            151,
            streamTop,
            178,
            Math.max(
                0,
                streamBottom -
                streamTop
            )
        );


        drawWave(
            streamTop,
            151,
            329,
            "#73b5ff"
        );
    }
}


// ============================================================
// PIN
// ============================================================

function drawPin() {

    if (state.pinPulled) {
        return;
    }


    const y =
        state.pinY;


    const start =
        79;


    const end =
        state.pinX;


    ctx.save();


    ctx.lineCap =
        "round";


    // Dark outline.

    ctx.strokeStyle =
        "#71370f";

    ctx.lineWidth = 19;


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


    // Gold body.

    const gold =
        ctx.createLinearGradient(
            0,
            y - 8,
            0,
            y + 8
        );


    gold.addColorStop(
        0,
        "#ffe074"
    );

    gold.addColorStop(
        0.35,
        "#ffc04d"
    );

    gold.addColorStop(
        1,
        "#df811a"
    );


    ctx.strokeStyle =
        gold;

    ctx.lineWidth = 13;


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


    // Gold highlight.

    ctx.strokeStyle =
        "#fff0a5";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.moveTo(
        start + 4,
        y - 4
    );

    ctx.lineTo(
        end - 7,
        y - 4
    );

    ctx.stroke();


    // Handle.

    ctx.fillStyle =
        "#f5a82d";

    ctx.strokeStyle =
        "#8b4815";

    ctx.lineWidth = 6;


    ctx.beginPath();

    ctx.arc(
        end,
        y,
        27,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();


    ctx.strokeStyle =
        "#ffe890";

    ctx.lineWidth = 5;


    ctx.beginPath();

    ctx.arc(
        end,
        y,
        16,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    // Left stopper.

    roundedRect(
        73,
        y - 18,
        27,
        36,
        7,
        "#f2a62d",
        "#7b3c10",
        4
    );


    ctx.restore();
}


// ============================================================
// SAND
// ============================================================

function drawSand() {

    const sand =
        new Path2D();


    sand.moveTo(
        84,
        672
    );


    sand.bezierCurveTo(
        125,
        661,
        149,
        680,
        181,
        671
    );


    sand.bezierCurveTo(
        215,
        661,
        243,
        680,
        274,
        671
    );


    sand.bezierCurveTo(
        311,
        661,
        344,
        681,
        398,
        670
    );


    sand.lineTo(
        401,
        716
    );


    sand.bezierCurveTo(
        333,
        747,
        166,
        748,
        86,
        714
    );


    sand.closePath();


    const gradient =
        ctx.createLinearGradient(
            0,
            670,
            0,
            745
        );


    gradient.addColorStop(
        0,
        "#9a702c"
    );

    gradient.addColorStop(
        1,
        "#6e4d20"
    );


    ctx.fillStyle =
        gradient;


    ctx.fill(
        sand
    );


    ctx.strokeStyle =
        "#d4ad35";

    ctx.lineWidth = 7;


    ctx.beginPath();

    ctx.moveTo(
        87,
        672
    );


    ctx.bezierCurveTo(
        125,
        661,
        149,
        680,
        181,
        671
    );


    ctx.bezierCurveTo(
        215,
        661,
        243,
        680,
        274,
        671
    );


    ctx.bezierCurveTo(
        311,
        661,
        344,
        681,
        398,
        670
    );


    ctx.stroke();


    // Sand speckles.

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const x =
            96 +
            ((i * 67) % 292);


        const y =
            687 +
            ((i * 31) % 35);


        ctx.fillStyle =
            i % 2
                ? "rgba(245,206,103,0.25)"
                : "rgba(55,35,12,0.22)";


        ctx.beginPath();

        ctx.arc(
            x,
            y,
            1.5 + (i % 2),
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ============================================================
// FISH
// ============================================================

function drawFish() {

    const fish =
        state.fish;


    ctx.save();


    ctx.translate(
        fish.x,
        fish.y
    );


    ctx.rotate(
        Math.sin(
            state.time * 0.045
        ) * 0.035
    );


    // Shadow.

    ctx.fillStyle =
        "rgba(0,0,0,0.18)";


    ctx.beginPath();

    ctx.ellipse(
        0,
        22,
        38,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Tail.

    ctx.fillStyle =
        "#aee75a";

    ctx.strokeStyle =
        "#5c9a35";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.moveTo(
        -27,
        0
    );

    ctx.lineTo(
        -52,
        -19
    );

    ctx.lineTo(
        -47,
        19
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Body.

    const body =
        ctx.createRadialGradient(
            -4,
            -7,
            4,
            -2,
            2,
            35
        );


    body.addColorStop(
        0,
        "#ffbd46"
    );

    body.addColorStop(
        0.5,
        "#f79527"
    );

    body.addColorStop(
        1,
        "#db641d"
    );


    ctx.fillStyle =
        body;

    ctx.strokeStyle =
        "#b9541c";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.ellipse(
        -3,
        0,
        31,
        24,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();


    // Top fin.

    ctx.fillStyle =
        "#b8ed62";


    ctx.beginPath();

    ctx.moveTo(
        -3,
        -19
    );

    ctx.lineTo(
        8,
        -39
    );

    ctx.lineTo(
        19,
        -15
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Bottom fin.

    ctx.beginPath();

    ctx.moveTo(
        2,
        18
    );

    ctx.lineTo(
        16,
        35
    );

    ctx.lineTo(
        23,
        12
    );

    ctx.closePath();

    ctx.fill();

    ctx.stroke();


    // Eye.

    ctx.fillStyle =
        "white";


    ctx.beginPath();

    ctx.arc(
        10,
        -8,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#17303a";


    ctx.beginPath();

    ctx.arc(
        13,
        -8,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Smile.

    ctx.strokeStyle =
        "#8d3f22";

    ctx.lineWidth = 2;


    ctx.beginPath();

    ctx.arc(
        13,
        4,
        6,
        0.15,
        1.15
    );

    ctx.stroke();


    ctx.restore();
}


// ============================================================
// SPLASH
// ============================================================

function spawnSplash() {

    state.splash = [];


    for (
        let i = 0;
        i < 34;
        i++
    ) {

        state.splash.push({

            x:
                215 +
                (Math.random() - 0.5) *
                110,

            y:
                325 +
                Math.random() * 20,

            vx:
                (Math.random() - 0.5) *
                2.4,

            vy:
                -Math.random() *
                3.5,

            life: 1
        });
    }
}


function updateSplash() {

    for (
        const particle
        of state.splash
    ) {

        particle.x +=
            particle.vx;

        particle.y +=
            particle.vy;

        particle.vy +=
            0.08;

        particle.life -=
            0.018;
    }


    state.splash =
        state.splash.filter(
            particle =>
                particle.life > 0
        );
}


function drawSplash() {

    for (
        const particle
        of state.splash
    ) {

        ctx.globalAlpha =
            Math.max(
                0,
                particle.life
            );


        ctx.fillStyle =
            "#76b9ff";


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            2.5,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    ctx.globalAlpha = 1;
}


// ============================================================
// GAME LOGIC
// ============================================================

function pullPin() {

    if (state.pinPulled) {
        return;
    }


    state.pinPulled =
        true;


    state.waterFlow =
        1;


    spawnSplash();
}


function update() {

    state.time++;


    if (state.pinPulled) {

        state.waterFlow =
            Math.min(
                85,
                state.waterFlow +
                0.65
            );


        // Fish slowly rises with the water.

        state.fish.y -=
            0.12;


        state.fish.x +=
            Math.sin(
                state.time *
                0.035
            ) * 0.35;


        if (
            state.fish.y < 610
        ) {

            state.fish.saved =
                true;
        }
    }


    updateSplash();
}


// ============================================================
// DRAW
// ============================================================

function draw() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    drawBackground();

    drawChamber();

    drawWater();

    drawSand();

    drawFish();

    drawPin();

    drawSplash();

    // UI last so it always stays visible.

    drawTopUI();
}


// ============================================================
// INPUT
// ============================================================

function canvasPoint(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            (event.clientX -
                rect.left)
            *
            W /
            rect.width,

        y:
            (event.clientY -
                rect.top)
            *
            H /
            rect.height
    };
}


canvas.addEventListener(
    "pointerdown",
    event => {

        const point =
            canvasPoint(event);


        const distance =
            Math.hypot(
                point.x -
                    state.pinX,

                point.y -
                    state.pinY
            );


        if (
            !state.pinPulled &&
            distance < 48
        ) {

            state.dragging =
                true;


            canvas.setPointerCapture(
                event.pointerId
            );
        }
    }
);


canvas.addEventListener(
    "pointermove",
    event => {

        if (
            !state.dragging ||
            state.pinPulled
        ) {
            return;
        }


        const point =
            canvasPoint(event);


        state.pinX =
            Math.max(
                state.pinStartX - 8,
                Math.min(
                    405,
                    point.x
                )
            );


        if (
            state.pinX > 382
        ) {

            pullPin();

            state.dragging =
                false;
        }
    }
);


canvas.addEventListener(
    "pointerup",
    event => {

        state.dragging =
            false;


        try {

            canvas.releasePointerCapture(
                event.pointerId
            );

        } catch (_) {}
    }
);


canvas.addEventListener(
    "pointercancel",
    () => {

        state.dragging =
            false;
    }
);


// ============================================================
// RESET BUTTON
// ============================================================

resetButton.addEventListener(
    "click",
    () => {

        resetGame();

        draw();
    }
);


// ============================================================
// START
// ============================================================

resetGame();


function loop() {

    update();

    draw();

    requestAnimationFrame(
        loop
    );
}


loop();
