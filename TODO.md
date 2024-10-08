1. Tests
2. When balls reach the hole, you have to start the board over.
3.  🟡 Replicate boards from Zuma (completed world 1)
4.  Bug when pushing/matching ball that falls into sink.
6.  mobile support, specifically landscape mode, hide panel,
    use full screen.
7.  When you use the backwards power-up, and balls go past the first waypoint, they get removed from the game. We should push these balls onto a queue to become the next spawned balls to provide continuity.
8.  Display text on the board including game over, board name, and when you start over, x lives left.
9.  Make accuracy ball graphic a triangle. Make it collide with the nearest ball.
11. bug where you get stuck when the balls go into the sink, everything seems to freeze.
14. When explosion removed an accuracy ball, accuracy effect was not applied.
15. Shot a ball near the tail and saw `TODO isCollidingWithPreviousBall true`. Handle this. After this happened, it seemed like the tail did not move, while the head moved alone. When I cleared the head, then the tail moved. What probably happened is that the tail somehow went ahead of the head. [Game](./game_ball_moves_back_forever.json)
16. Tried to clear 2 blue balls in 1-5. I hit the tail (I think), then one of the balls kept going backwards indefinitely, and I hit `console.error("Do not remove a ball in this method");` The ball was removed after it went too far backwards, and the other 2 blue balls resumed continuing forward. Possibly insertion exceeded some threshold?
