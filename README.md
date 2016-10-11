# Tic-Tac-Toe
A simple tic-tac-toe app.

## Build Tools
This app's build configuration can be found in `gulpfile.js`. JavaScript, CSS, and HTML are minified, and each bundled into their individual file.

## Under the Hood
Here's the technology I used:
- Vanilla JavaScript (aww yeah!)
- Sass/SCSS
- Node.js
- Gulp

To keep track of the app, I created a state object. Anything which affects the game will update the state. The state is immutable, with the new state appended to the existing array of states.

On each update to the state, the app is notified of any new changes. If any part of the state is changed, the app will update the appropriate UI. For example, when a user marks an empty square, a new state is added with the square's new value. During this update, the app is notified of the new square value, and reflects this change in the view.

## Computer AI
The computer player's AI (no emphasis on the intelligence part) is simple but not easy.
It first checks to see if it can win. If not, it checks to block Player if they are in a postition to win. If those two aren't options, it looks for a row, column, diagonal which already has its own mark and no Player marks, and marks the first empty space. Finally, if all else fails, it will mark the first empty square.

This results in a difficult but not impossible opponent.