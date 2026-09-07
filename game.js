const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const TAU = Math.PI * 2;

let state;
let lastTime = performance.now();

function resetGame() {
    state = {
        time: 0,
        pinX: 304,
        pinTargetX: 304,
        pinPulled: false,
        dragging: false,
        pointerOffset: 0,
        water: 0,
        waterTarget: 0,
        fishX: 215,
        fishY: 700,
        fishVX: 0,
        rescued: false,
        splash: [],
        bubbles: [],
        droplets: []
    };

    for (let i = 0; i < 18; i++) {
        state.bubbles.push({
            x: 35 + Math.random() * 360,
            y: 80 + Math.random() * 630,
            r: 1.5 + Math.random() * 4,
            speed: 8 + Math.random() * 16,
            phase: Math.random() * TAU
        });
    }
}

resetGame();

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp(t, 0, 1), 3);
}

function roundedRectPath(x, y, w, h, r) {
    const p = new Path2D();
    p.moveTo(x + r, y);
    p.lineTo(x + w - r, y);
    p.quadraticCurveTo(x + w, y, x + w, y + r);
    p.lineTo(x + w, y + h - r);
    p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    p.lineTo(x + r, y + h);
    p.quadraticCurveTo(x, y + h, x, y + h - r);
    p.lineTo(x, y + r);
    p.quadraticCurveTo(x, y, x + r, y);
    p.closePath();
    return p;
}

function chamberPath() {
    const p = new Path2D();
    p.moveTo(139, 158);
    p.bezierCurveTo(127, 184, 132, 214, 137, 243);
    p.bezierCurveTo(142, 279, 132, 320, 137, 358);
    p.bezierCurveTo(142, 401, 132, 445, 138, 488);
    p.bezierCurveTo(143, 531, 139, 568, 151, 600);
    p.bezierCurveTo(164, 634, 184, 651, 215, 651);
    p.bezierCurveTo(246, 651, 266, 634, 279, 600);
    p.bezierCurveTo(291, 568, 287, 531, 292, 488);
    p.bezierCurveTo(298, 445, 288, 401, 293, 358);
    p.bezierCurveTo(298, 320, 288, 279, 293, 243);
    p.bezierCurveTo(298, 214, 303, 184, 291, 158);
    p.closePath();
    return p;
}

function drawBackground(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#21dce5");
    g.addColorStop(0.52, "#11cbdc");
    g.addColorStop(1, "#08aec9");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.10;
    ctx.lineWidth = 2;

    for (let band = 0; band < 5; band++) {
        const y0 = 95 + band * 145;
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += 8) {
            const y = y0 +
                Math.sin(x * 0.018 + t * 0.00045 + band) * 8 +
                Math.sin(x * 0.041 - t * 0.0003) * 4;
            if (x === -20) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 7; i++) {
        const x = 25 + i * 67;
        const y = 110 + Math.sin(t * 0.00035 + i) * 25;
        ctx.beginPath();
        ctx.ellipse(x, y, 18, 5, -0.25, 0, TAU);
        ctx.fill();
    }
    ctx.restore();
}

function drawTopUI() {
    // UI backing strip
    ctx.save();
    ctx.fillStyle = "rgba(5, 146, 170, 0.28)";
    ctx.beginPath();
    ctx.roundRect(12, 12, 406, 64, 23);
    ctx.fill();

    // Gear
    ctx.fillStyle = "#f7fbff";
    ctx.beginPath();
    ctx.arc(50, 44, 20, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#5aa7b7";
    ctx.beginPath();
    ctx.arc(50, 44, 8, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#5aa7b7";
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i++) {
        const a = i * TAU / 8;
        ctx.beginPath();
        ctx.moveTo(50 + Math.cos(a) * 17, 44 + Math.sin(a) * 17);
        ctx.lineTo(50 + Math.cos(a) * 22, 44 + Math.sin(a) * 22);
        ctx.stroke();
    }

    // Tool icon
    ctx.fillStyle = "#75cf49";
    ctx.beginPath();
    ctx.arc(102, 44, 21, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(95, 51);
    ctx.lineTo(109, 37);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(112, 35, 7, -0.7, 1.8);
    ctx.stroke();

    // Level
    ctx.fillStyle = "#63d04a";
    ctx.beginPath();
    ctx.roundRect(135, 25, 137, 38, 19);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LEVEL 1", 203.5, 44);

    // Skip
    ctx.fillStyle = "#3194e7";
    ctx.beginPath();
    ctx.roundRect(281, 25, 77, 38, 19);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 16px Arial";
    ctx.fillText("SKIP", 319.5, 44);

    // Reset icon
    ctx.strokeStyle = "#ffd43b";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(393, 44, 17, -0.65, 5.25);
    ctx.stroke();
    ctx.fillStyle = "#ffd43b";
    ctx.beginPath();
    ctx.moveTo(406, 29);
    ctx.lineTo(408, 45);
    ctx.lineTo(393, 38);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function drawCave(t) {
    const cave = chamberPath();

    // Outer shadow
    ctx.save();
    ctx.shadowColor = "rgba(0, 78, 91, 0.25)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "#8ddce2";
    ctx.fill(cave);
    ctx.restore();

    // Ice rim
    ctx.save();
    ctx.strokeStyle = "#e7fbf8";
    ctx.lineWidth = 16;
    ctx.lineJoin = "round";
    ctx.stroke(cave);

    ctx.strokeStyle = "rgba(133, 221, 225, 0.9)";
    ctx.lineWidth = 6;
    ctx.stroke(cave);

    // Cave interior
    const inside = new Path2D();
    inside.moveTo(151, 164);
    inside.bezierCurveTo(143, 210, 150, 246, 149, 284);
    inside.bezierCurveTo(148, 328, 147, 365, 151, 405);
    inside.bezierCurveTo(155, 449, 150, 492, 156, 536);
    inside.bezierCurveTo(161, 575, 174, 618, 215, 632);
    inside.bezierCurveTo(256, 618, 269, 575, 274, 536);
    inside.bezierCurveTo(280, 492, 275, 449, 279, 405);
    inside.bezierCurveTo(283, 365, 282, 328, 281, 284);
    inside.bezierCurveTo(280, 246, 287, 210, 279, 164);
    inside.closePath();

    const caveGrad = ctx.createLinearGradient(145, 0, 285, 0);
    caveGrad.addColorStop(0, "#063e54");
    caveGrad.addColorStop(0.5, "#07546a");
    caveGrad.addColorStop(1, "#043b51");
    ctx.fillStyle = caveGrad;
    ctx.fill(inside);

    // Ice scallops / highlights
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#ffffff";
    for (let side = 0; side < 2; side++) {
        for (let i = 0; i < 13; i++) {
            const y = 178 + i * 36;
            const x = side === 0 ? 140 + Math.sin(i * 1.7) * 4 : 290 + Math.sin(i * 1.9) * 4;
            ctx.beginPath();
            ctx.arc(x, y, 5 + (i % 3), 0, TAU);
            ctx.fill();
        }
    }
    ctx.restore();

    // Interior caustics
    ctx.save();
    ctx.clip(inside);
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "#a9ffff";
    ctx.lineWidth = 3;

    for (let i = 0; i < 6; i++) {
        const y = 225 + i * 72 + Math.sin(t * 0.001 + i) * 8;
        ctx.beginPath();
        for (let x = 145; x <= 285; x += 6) {
            const yy = y + Math.sin(x * 0.05 + t * 0.0014 + i) * 5;
            if (x === 145) ctx.moveTo(x, yy);
            else ctx.lineTo(x, yy);
        }
        ctx.stroke();
    }
    ctx.restore();
}

function drawWater(t) {
    // Top reservoir
    const waterTop = 117 + Math.sin(t * 0.0013) * 2;

    const reservoir = roundedRectPath(148, 82, 134, 92, 20);
    const g = ctx.createLinearGradient(0, 82, 0, 174);
    g.addColorStop(0, "#48e7f2");
    g.addColorStop(1, "#069fc5");

    ctx.save();
    ctx.fillStyle = g;
    ctx.fill(reservoir);

    ctx.clip(reservoir);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        for (let x = 138; x <= 292; x += 5) {
            const y = waterTop + i * 18 +
                Math.sin(x * 0.065 + t * 0.002 + i) * 3;
            if (x === 138) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.lineTo(292, 190);
        ctx.lineTo(138, 190);
        ctx.closePath();
        ctx.fill();
    }
    ctx.restore();

    // Animated surface
    ctx.save();
    ctx.strokeStyle = "rgba(231,255,255,0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 149; x <= 281; x += 4) {
        const y = waterTop +
            Math.sin(x * 0.08 + t * 0.002) * 2.5 +
            Math.sin(x * 0.031 - t * 0.001) * 1.4;
        if (x === 149) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Flow only after pin is pulled
    if (state.water > 0.01) {
        const amount = state.water;
        const top = 160;
        const bottom = lerp(160, 620, amount);

        ctx.save();
        const stream = new Path2D();
        stream.moveTo(184, top);
        stream.bezierCurveTo(
            177 + Math.sin(t * 0.002) * 7, 250,
            192 + Math.sin(t * 0.0025) * 10, 330,
            186 + Math.sin(t * 0.0018) * 8, bottom
        );
        stream.lineTo(244 + Math.sin(t * 0.0018) * 8, bottom);
        stream.bezierCurveTo(
            238 + Math.sin(t * 0.0025) * 10, 330,
            253 + Math.sin(t * 0.002) * 7, 250,
            246, top
        );
        stream.closePath();

        const sg = ctx.createLinearGradient(180, 0, 250, 0);
        sg.addColorStop(0, "rgba(66,231,241,0.45)");
        sg.addColorStop(0.5, "rgba(161,251,251,0.72)");
        sg.addColorStop(1, "rgba(28,194,220,0.35)");
        ctx.fillStyle = sg;
        ctx.fill(stream);

        // Flow streaks
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = "#d5ffff";
        ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
            const yy = top + ((t * (0.12 + i * 0.008) + i * 67) % Math.max(40, bottom - top));
            const cx = 215 + Math.sin(yy * 0.035 + t * 0.0017 + i) * 17;
            ctx.beginPath();
            ctx.moveTo(cx - 4, yy);
            ctx.quadraticCurveTo(cx, yy + 8, cx + 2, yy + 17);
            ctx.stroke();
        }
        ctx.restore();
    }
}

function drawPin() {
    const y = 202;
    const x1 = 151;
    const x2 = state.pinX;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 4;

    const pinGrad = ctx.createLinearGradient(0, y - 8, 0, y + 8);
    pinGrad.addColorStop(0, "#ffe77a");
    pinGrad.addColorStop(0.45, "#ffbf20");
    pinGrad.addColorStop(1, "#e08b08");

    ctx.fillStyle = pinGrad;
    ctx.beginPath();
    ctx.roundRect(x1, y - 8, x2 - x1, 16, 8);
    ctx.fill();

    // Handle ring
    ctx.shadowBlur = 5;
    ctx.fillStyle = "#ffca2a";
    ctx.beginPath();
    ctx.arc(x2, y, 21, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#f4b218";
    ctx.beginPath();
    ctx.arc(x2, y, 10, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#174b58";
    ctx.beginPath();
    ctx.arc(x2, y, 6, 0, TAU);
    ctx.fill();

    ctx.restore();

    // shine
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1 + 10, y - 3);
    ctx.lineTo(x2 - 29, y - 3);
    ctx.stroke();
    ctx.restore();
}

function drawSand(t) {
    const sand = new Path2D();
    sand.moveTo(0, 665);
    for (let x = 0; x <= W; x += 8) {
        const y = 677 +
            Math.sin(x * 0.028 + 1.2) * 7 +
            Math.sin(x * 0.071 + t * 0.0004) * 3;
        sand.lineTo(x, y);
    }
    sand.lineTo(W, H);
    sand.lineTo(0, H);
    sand.closePath();

    const g = ctx.createLinearGradient(0, 660, 0, H);
    g.addColorStop(0, "#dcae50");
    g.addColorStop(0.45, "#c98e39");
    g.addColorStop(1, "#a96c2d");

    ctx.fillStyle = g;
    ctx.fill(sand);

    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#fff0a8";
    for (let i = 0; i < 25; i++) {
        const x = (i * 83) % W;
        const y = 705 + ((i * 47) % 58);
        ctx.beginPath();
        ctx.ellipse(x, y, 2 + (i % 3), 1.5, 0, 0, TAU);
        ctx.fill();
    }
    ctx.restore();
}

function fishBodyPath(x, y, scale, bend) {
    const p = new Path2D();
    p.moveTo(x - 37 * scale, y);
    p.bezierCurveTo(
        x - 29 * scale, y - 25 * scale,
        x + 11 * scale, y - 28 * scale,
        x + 30 * scale, y - 8 * scale
    );
    p.bezierCurveTo(
        x + 42 * scale, y + 4 * scale,
        x + 34 * scale, y + 22 * scale,
        x + 7 * scale, y + 27 * scale
    );
    p.bezierCurveTo(
        x - 16 * scale, y + 30 * scale,
        x - 34 * scale, y + 19 * scale,
        x - 37 * scale, y
    );
    p.closePath();
    return p;
}

function drawFish(t) {
    const swim = Math.sin(t * 0.004);
    const bob = Math.sin(t * 0.0022) * 2.5;
    const x = state.fishX;
    const y = state.fishY + bob;
    const s = 1;
    const tailWave = Math.sin(t * 0.008) * 0.12;

    ctx.save();

    // shadow
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#174451";
    ctx.beginPath();
    ctx.ellipse(x, y + 29, 44, 7, 0, 0, TAU);
    ctx.fill();

    // tail
    ctx.save();
    ctx.translate(x + 27, y);
    ctx.rotate(tailWave);
    const tail = new Path2D();
    tail.moveTo(0, 0);
    tail.bezierCurveTo(16, -25, 34, -25, 43, -14);
    tail.bezierCurveTo(36, -3, 36, 9, 43, 18);
    tail.bezierCurveTo(28, 27, 12, 21, 0, 5);
    tail.closePath();

    const tg = ctx.createLinearGradient(0, -25, 0, 25);
    tg.addColorStop(0, "#ffb126");
    tg.addColorStop(0.55, "#f18a14");
    tg.addColorStop(1, "#d8640c");
    ctx.fillStyle = tg;
    ctx.fill(tail);
    ctx.restore();

    // lower fin
    ctx.fillStyle = "#e56e0d";
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 18);
    ctx.bezierCurveTo(x + 5, y + 24, x + 12, y + 29, x + 8, y + 35);
    ctx.bezierCurveTo(x - 1, y + 31, x - 8, y + 26, x - 9, y + 20);
    ctx.closePath();
    ctx.fill();

    // upper fin
    ctx.fillStyle = "#f07b0f";
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 18);
    ctx.bezierCurveTo(x - 2, y - 31, x + 12, y - 34, x + 16, y - 23);
    ctx.bezierCurveTo(x + 8, y - 17, x, y - 15, x - 8, y - 18);
    ctx.closePath();
    ctx.fill();

    // body
    const bodyGrad = ctx.createRadialGradient(x - 13, y - 10, 3, x, y, 43);
    bodyGrad.addColorStop(0, "#ffd35a");
    bodyGrad.addColorStop(0.42, "#ffae25");
    bodyGrad.addColorStop(0.82, "#ee8213");
    bodyGrad.addColorStop(1, "#cc5c0b");

    ctx.fillStyle = bodyGrad;
    ctx.fill(fishBodyPath(x, y, s, swim));

    // belly highlight
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = "#fff1a8";
    ctx.beginPath();
    ctx.ellipse(x - 9, y + 9, 20, 9, -0.15, 0, TAU);
    ctx.fill();
    ctx.restore();

    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 20, y - 8, 9, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#143d4a";
    ctx.beginPath();
    ctx.arc(x - 22, y - 8, 4.5, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - 23.5, y - 10, 1.6, 0, TAU);
    ctx.fill();

    // smile
    ctx.strokeStyle = "#9c430b";
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(x - 20, y + 2, 8, 0.1, 0.9);
    ctx.stroke();

    // gill
    ctx.strokeStyle = "rgba(157,70,10,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x - 2, y, 12, -0.9, 0.9);
    ctx.stroke();

    ctx.restore();
}

function addSplash(x, y) {
    for (let i = 0; i < 28; i++) {
        const a = Math.random() * TAU;
        const speed = 40 + Math.random() * 130;
        state.splash.push({
            x, y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed - 45,
            life: 0.7 + Math.random() * 0.5,
            age: 0,
            size: 2 + Math.random() * 4
        });
    }
}

function drawParticles(dt) {
    for (const b of state.bubbles) {
        b.y -= b.speed * dt;
        b.x += Math.sin(state.time * 0.0015 + b.phase) * 0.15;
        if (b.y < 75) {
            b.y = 650 + Math.random() * 80;
            b.x = 30 + Math.random() * 370;
        }

        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.stroke();
        ctx.restore();
    }

    for (let i = state.splash.length - 1; i >= 0; i--) {
        const p = state.splash[i];
        p.age += dt;
        p.vy += 170 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const alpha = 1 - p.age / p.life;
        if (alpha <= 0) {
            state.splash.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#eaffff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, TAU);
        ctx.fill();
        ctx.restore();
    }
}

function update(dt) {
    state.time += dt * 1000;

    // Pin follows the user's drag, then eases to its final position.
    if (!state.dragging) {
        state.pinX += (state.pinTargetX - state.pinX) * Math.min(1, dt * 14);
    }

    // Water gradually fills the chamber after the pin is removed.
    if (state.pinPulled) {
        state.waterTarget = 1;
        state.water += (state.waterTarget - state.water) * Math.min(1, dt * 1.5);

        // Fish reacts to rising water with a gentle buoyant movement.
        const targetY = 700 - state.water * 62;
        state.fishY += (targetY - state.fishY) * Math.min(1, dt * 1.8);
        state.fishX += Math.sin(state.time * 0.0015) * dt * 8;
        state.fishX = clamp(state.fishX, 170, 260);

        if (!state.rescued && state.water > 0.86) {
            state.rescued = true;
            addSplash(state.fishX, state.fishY);
        }
    }
}

function draw(t) {
    ctx.clearRect(0, 0, W, H);

    drawBackground(t);
    drawWater(t);
    drawCave(t);
    drawSand(t);
    drawFish(t);

    if (!state.pinPulled) {
        drawPin();
    }

    drawParticles(0);
    drawTopUI();

    if (state.rescued) {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.92)";
        ctx.beginPath();
        ctx.roundRect(115, 610, 200, 54, 27);
        ctx.fill();

        ctx.fillStyle = "#179a72";
        ctx.font = "900 22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("FISH RESCUED!", 215, 637);
        ctx.restore();
    }
}

function canvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * W / rect.width,
        y: (e.clientY - rect.top) * H / rect.height
    };
}

function pointerDown(e) {
    const p = canvasPoint(e);

    if (!state.pinPulled &&
        Math.hypot(p.x - state.pinX, p.y - 202) < 42) {
        state.dragging = true;
        state.pointerOffset = p.x - state.pinX;
        canvas.setPointerCapture(e.pointerId);
        e.preventDefault();
    }
}

function pointerMove(e) {
    if (!state.dragging) return;

    const p = canvasPoint(e);
    state.pinX = clamp(p.x - state.pointerOffset, 180, 410);

    if (state.pinX > 365) {
        state.pinPulled = true;
        state.dragging = false;
        state.pinTargetX = 410;
        addSplash(215, 205);
        try {
            canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
    }

    e.preventDefault();
}

function pointerUp(e) {
    if (!state.dragging) return;
    state.dragging = false;
    state.pinTargetX = 304;
    e.preventDefault();
}

canvas.addEventListener("pointerdown", pointerDown);
canvas.addEventListener("pointermove", pointerMove);
canvas.addEventListener("pointerup", pointerUp);
canvas.addEventListener("pointercancel", pointerUp);

document.getElementById("resetButton").addEventListener("click", resetGame);

function frame(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;

    update(dt);
    draw(now);

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
