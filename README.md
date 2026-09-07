Pull the Lever Fish 🐠

A mobile-friendly HTML5 puzzle game inspired by classic pull-the-pin /
rescue-the-fish games.

Project Status

🚧 Level 1 — Prototype / Development

The project is being developed step by step, with the goal of recreating
the visual style and puzzle mechanics of the provided reference game.

Current Game

Level 1

The player must:

1. Observe the puzzle chamber.
2. Pull the gold pin.
3. Release the water.
4. Rescue the fish.

Technologies

• HTML5 — page structure
• CSS3 — layout and responsive presentation
• JavaScript — game logic, drawing, animation, and interaction
• HTML5 Canvas — game graphics
• GitHub Pages — web hosting

Project Structure

```text
pull-the-lever-fish/
├── index.html
├── style.css
├── game.js
└── README.md
```

Development Goals

• 🎨 Cartoon-style underwater graphics
• 🧊 Organic ice/cave structures
• 💧 Animated water
• 🪙 Interactive gold pins
• 🐠 Improved fish character
• 🫧 Bubbles and underwater effects
• 🎮 Mobile and desktop controls
• 🧩 Multiple puzzle levels
• 🏆 Level completion and progression
• 🔄 Reset and skip functionality

Target Platform

The primary target is a mobile portrait layout, while keeping the game
playable in modern desktop browsers.

Development

The project is hosted using GitHub Pages.

When making changes:

1. Edit the relevant file.
2. Commit the changes to the main branch.
3. Wait for GitHub Pages to deploy.
4. Refresh the game.

If the browser displays an older version after an update, use a hard
refresh:

• Windows: Ctrl + Shift + R
• Mac: Cmd + Shift + R

License

This is a personal learning/development project. The game’s code and
original artwork are being developed for this project.

A mobile-first HTML5 puzzle game inspired by classic pull-the-pin /

rescue games, with an underwater cartoon theme.

Current Development Status

Level 1 — Visual & Animation Overhaul in progress

The project is currently focused on making the game feel like a polished

2D mobile game rather than a collection of simple geometric shapes.

Current Level 1 goals

● Rescue the fish by pulling the correct gold pin.

● Build an organic underwater environment.

● Improve the fish character silhouette and animation.

● Make water behave and animate like a fluid volume.

● Add smooth movement, easing, waves, splashes, and environmental

motion.

● Improve the cave/chamber depth, curves, ice edges, lighting, and

visual layering.

● Keep the game optimized for a vertical mobile screen.

Visual Development Roadmap

1. Character quality

The fish will be rebuilt from smooth curved silhouettes rather than

basic ellipses and triangles.

Planned improvements:

● Bézier-based body and tail shapes

● Curved fins

● Layered shading and highlights

● Natural eye and facial details

● Gentle swimming deformation

● Tail and fin motion

● Subtle floating/bobbing movement

2. Fluid animation

Water will be treated as an animated volume rather than a static blue

rectangle.

Planned improvements:

● Moving water surface

● Curved flowing stream

● Internal water movement

● Animated highlights and caustics

● Acceleration and easing

● Splash and foam effects

● Small droplets and bubbles

● Continuous 60 FPS animation

3. Environment

The cave/chamber will receive more organic geometry and depth.

Planned improvements:

● Curved cave walls

● Irregular icy edges

● Layered shadows

● Highlights along the ice

● Atmospheric underwater lighting

● Background wave patterns

● Depth through overlapping layers

4. Motion system

The game will use a proper animation/update system rather than relying

only on objects being moved directly.

The intended structure is:

```text

Input

↓

Game State

↓

Animation / Physics

↓

Easing / Interpolation

↓

Particle & Fluid Effects

↓

Rendering

```

This allows objects to move smoothly and makes the environment feel

alive.

Technology

● HTML5

● CSS3

● JavaScript

● HTML Canvas

● GitHub Pages

No external game engine is currently required.

Project Structure

```text

pull-the-lever-fish/

├── README.md

├── index.html

├── style.css

└── game.js

```

index.html

Provides the page structure and canvas.

style.css

Controls the page layout, responsive sizing, canvas presentation, and

reset control.

game.js

Contains:

● Game state

● Input handling

● Drawing/rendering

● Animation loop

● Fish

● Water

● Pin

● Cave

● Particles

● UI

● Level 1 gameplay

Target Platform

The game is designed primarily for:

● Mobile phones

● Portrait orientation

● Touch input

Desktop browsers are also supported for development and testing.

Target canvas:

430 × 780 pixels

The canvas scales responsively to fit smaller screens.

Development Approach

The project is being developed in stages.

Stage 1 — Foundation

● Canvas

● Responsive layout

● Basic Level 1 interaction

● Pin dragging

● Reset functionality

Stage 2 — Visual Overhaul

● Organic shapes

● Character redesign

● Fluid water

● Lighting

● Depth

● Environmental animation

Stage 3 — Game Feel

● Smooth easing

● Better drag feedback

● Splash effects

● Fish swimming

● Pin movement feedback

● More responsive touch interaction

Stage 4 — Additional Levels

Future levels may introduce:

● Additional pins

● Different chambers

● Hazards

● More complex water routing

● New obstacles

● Multiple fish

● Increasing puzzle difficulty

GitHub Pages

The project is intended to run directly from GitHub Pages.

Typical workflow:

1. Edit a project file on GitHub.

2. Commit the change.

3. Wait for GitHub Pages to update.

4. Open the live game.

5. Hard-refresh the browser when an older JavaScript file appears to be

cached.

Learning Goals

This project is also a learning exercise for understanding how a

browser-based game is built from the ground up.

Important concepts include:

● HTML structure

● CSS layout

● JavaScript programming

● Canvas rendering

● Coordinate systems

● Pointer/touch events

● Animation loops

● Game state

● Easing and interpolation

● Bézier curves

● Particle systems

● Basic 2D game architecture

License

Personal learning/development project.
