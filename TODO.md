1. Tests
1. ~~Balls should look as if they are dropping into a hole as 
   they reach the last waypoint.~~
1. ~~When 3 matching color balls are connected in a row, they
   should disappear.~~
1. Balls should appear on the board. The new ball should be the
   foot of the chain and push the other balls forward (see next item).
   New balls should be created as needed. Perhaps when the foot
   stops colliding with the first waypoint? In Zuma, balls always
   come from off-screen.
2. ~~Instead of moving from the front, maybe all balls should move
   from the back. A ball should only move if there is a collision
   with the ball behind it. When calculating collision, we can use
   a slightly larger radius.~~
3. When there is a gap in a chain, there are two cases. If
   the balls on each end match in color, then pull the more
   forward chain back onto the other chain.
4. If the balls do not match color, the backmost chain should
   continue forward until it comes into contact with the next
   chain, then start to push it.
