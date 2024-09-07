1. Tests
2. ~~Seems like there are problems caused by having the hidden
   balls at the beginning and end. IIRC I added them so it
   was easier to figure out where to insert balls, but I
   can just insert before the collided ball for now.~~
4. ~~Balls should appear on the board. The new ball should be the
   foot of the chain and push the other balls forward (see next item).
   New balls should be created as needed. Perhaps when the foot
   stops colliding with the first waypoint? In Zuma, balls always
   come from off-screen.~~
5. When there is a gap in a chain, there are two cases. If
   the balls on each end match in color, then pull the more
   forward chain back onto the other chain.
6. If the balls do not match color, the backmost chain should
   continue forward until it comes into contact with the next
   chain, then start to push it.
