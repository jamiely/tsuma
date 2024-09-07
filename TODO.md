1. Tests
1. ~~Balls should look as if they are dropping into a hole as 
   they reach the last waypoint.~~
1. ~~When 3 matching color balls are connected in a row, they
   should disappear.~~
1. Instead of moving from the front, maybe all balls should move
   from the back. A ball should only move if there is a collision
   with the ball behind it. When calculating collision, we can use
   a slightly larger radius.
1. When there is a gap in a chain, there are two cases. If
   the balls on each end match in color, then pull the more
   forward chain back onto the other chain.
1. If the balls do not match color, the backmost chain should
   continue forward until it comes into contact with the next
   chain, then start to push it.
