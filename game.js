* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    min-height: 100%;
}

body {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    padding: 16px;

    background: #eafcff;

    font-family:
        Arial,
        Helvetica,
        sans-serif;
}

.game-container {
    width: min(430px, 100%);
}

canvas {
    display: block;

    width: 100%;
    height: auto;

    border-radius: 30px;

    box-shadow:
        0 12px 32px
        rgba(21, 89, 105, 0.20);

    touch-action: none;

    background: #19d6e2;
}

.controls {
    display: flex;
    justify-content: center;

    padding-top: 10px;
}

#resetButton {
    min-height: 44px;

    padding: 9px 20px;

    border: 0;
    border-radius: 15px;

    background: #18a9d7;

    color: white;

    font-size: 16px;
    font-weight: 800;

    box-shadow:
        0 4px 0 #087da8;

    cursor: pointer;
}

#resetButton:active {
    transform: translateY(2px);

    box-shadow:
        0 2px 0 #087da8;
}
