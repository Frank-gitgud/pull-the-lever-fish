# pull-the-lever-fish
Pull the lever replica
# Pin Rescue — Level 1

This is a self-contained HTML/CSS/JavaScript prototype based on the supplied Level 1 reference image.

## Run on desktop

No server is required.

1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, Firefox, or Safari.
3. Drag the gold ring on the pin to the right.
4. The water is released and the fish is rescued.
5. Use Reset Level to restart.

## Project files

- `index.html` — page structure and canvas
- `style.css` — responsive desktop/mobile styling
- `game.js` — drawing, input, pin interaction, water particles, win state

## Important

The graphics are recreated with Canvas vector drawing. No external image, library, font, or server is required.

This is a prototype of Level 1. The next levels can use the same engine with additional pins, chambers, water/lava, hazards, and level data.

## Turning it into an app

### Android/iOS with Capacitor

Install Node.js, then from this folder:

    npm init -y
    npm install @capacitor/core @capacitor/cli
    npx cap init "Pin Rescue" "com.example.pinrescue"

Create a `www` folder and put `index.html`, `style.css`, and `game.js` inside it. Then:

    npm install @capacitor/android @capacitor/ios
    npx cap add android
    npx cap add ios
    npx cap copy
    npx cap open android
    npx cap open ios

Android Studio can build the Android app; Xcode can build the iOS app.

### Desktop with Electron

The same HTML/CSS/JS can also be packaged with Electron. A future version can include an Electron wrapper if you want a standalone `.exe`/macOS app.

## Next development step

The current level intentionally focuses on reproducing the Level 1 board and pin interaction. The next engine upgrade should make the fluids behave more like the reference game: actual chamber collision, gravity, multiple pins, fluid separation, and level-specific puzzle logic.