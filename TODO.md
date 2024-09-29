1. Tests
2. When balls reach the hole, you have to start the board over.
3.  🟡 Replicate boards from Zuma (completed world 1)
4.  Bug when pushing/matching ball that falls into sink.
5.  Start the level over when you lose.
6.  mobile support, specifically landscape mode, hide panel,
    use full screen.
7.  ~~There is some bug clearing a match where the match happens right before the tail. Might happen after a magnetic. The tail will also get erroneously cleared.~~
8.  When you use the backwards power-up, and balls go past the first waypoint, they get removed from the game. We should push these balls onto a queue to become the next spawned balls to provide continuity.
9.  Display text on the board including game over, board name, and when you start over, x lives left.
10. Make accuracy ball graphic a triangle. Make it collide with the nearest ball.
11. ~~It's possible for an effect to persist even after it is removed from the game.effects array. Change how these effects are stored.~~
12. bug where you get stuck when the balls go into the sink, everything seems to freeze.
13. ~~Somehow launched a black ball.~~ addressed this by ensuring there is always some color (not undefined);
14. Create a disconnected section by clearing matches on either end. Now pull that segment using magnetic. The segment's balls will stretch out a bit for a few pixels but otherwise won't move. The magnetic will not apply.
