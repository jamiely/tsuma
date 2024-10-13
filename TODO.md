1. Tests
2. ~~When balls reach the hole, you have to start the board over.~~
3.  🟡 Replicate boards from Zuma (completed world 1)
4. ~~Bug when pushing/matching ball that falls into sink.~~
6.  mobile support, specifically landscape mode, hide panel,
    use full screen.
7.  When you use the backwards power-up, and balls go past the first waypoint, they get removed from the game. We should push these balls onto a queue to become the next spawned balls to provide continuity.
8.  Display text on the board including game over, board name, and when you start over, x lives left.
9.  Make accuracy ball graphic a triangle. Make it collide with the nearest ball.
10. When explosion removed an accuracy ball, accuracy effect was not applied.
11. Shot a ball near the tail and saw `TODO isCollidingWithPreviousBall true`. Handle this. After this happened, it seemed like the tail did not move, while the head moved alone. When I cleared the head, then the tail moved. What probably happened is that the tail somehow went ahead of the head. [Game](./game_ball_moves_back_forever.json)
