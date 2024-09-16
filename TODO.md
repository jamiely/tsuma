1. Tests
2. ~~When there is a gap in a chain, if
   the balls on each end match in color, then pull the more
   forward chain back onto the other chain, as if they are
   magnetically attracted.~~
3. When balls reach the hole, you have to start the board over.
4. When balls reach the hole, flush all of the balls into the
   hole by increasing the speed a lot.
5. Game freezes when chained ball speed is more than 2.
6. Tail doesn't disappear down hole.
7.  There is still a bug inserting if the free ball is very aligned to the normal.
8.  ~~When there is a gap in the chain, and a ball is inserted into the tailward piece, between two existing balls, then the headward piece will also get pushed up.~~
9.  Sometimes balls don't quite touch, especially when increasing speeds, leading to situations where a match doesn't clear.
10. After implementing magnetic, there are some weird collision
    problems. Two options.
    a. Get better with the math.
    b. Eschew the math for more specific flags, like 'isTouchingPrevious'.
11. ~~There is a bug inserting before the tail~~
