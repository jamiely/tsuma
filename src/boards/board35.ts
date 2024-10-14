import { Board, Rectangle } from "@/types";
import { chaikinSmoothing, defaultColors } from "@/util";
import { createWaypointPathCustom } from "@/path";

export const board35 = (bounds: Rectangle): Board => {
  return {
    name: "3-5 Mirror Snakes",
    launcherPosition: {
      x: bounds.size.width * 7/20,
      y: bounds.size.height * 11/20,
    },
    ballCount: 100,
    paths: [
      createWaypointPathCustom(() => points1()),
      createWaypointPathCustom(() => points2()),
    ],
    colors: defaultColors,
  };
};

function* points1() {
    const all = [
        {
            "x": -50,
            "y": 86
        },
        {
            "x": 43,
            "y": 86
        },
        {
            "x": 843,
            "y": 83
        },
        {
            "x": 904,
            "y": 102
        },
        {
            "x": 950,
            "y": 133
        },
        {
            "x": 952,
            "y": 184
        },
        {
            "x": 951,
            "y": 448
        },
        {
            "x": 924,
            "y": 501
        },
        {
            "x": 836,
            "y": 521
        },
        {
            "x": 282,
            "y": 526
        },
        {
            "x": 203,
            "y": 523
        },
        {
            "x": 165,
            "y": 493
        },
        {
            "x": 167,
            "y": 430
        },
        {
            "x": 170,
            "y": 222
        },
        {
            "x": 179,
            "y": 183
        },
        {
            "x": 241,
            "y": 172
        },
        {
            "x": 743,
            "y": 171
        },
        {
            "x": 809,
            "y": 187
        },
        {
            "x": 820,
            "y": 225
        },
        {
            "x": 816,
            "y": 347
        },
        {
            "x": 808,
            "y": 378
        },
        {
            "x": 765,
            "y": 403
        },
        {
            "x": 551,
            "y": 401
        },
        {
            "x": 535,
            "y": 400
        },
        {
            "x": 535,
            "y": 400
        }
    ];
    

    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }


  function* points2() {
    const all = [
        {
            "x": 1050,
            "y": 44
        },
        {
            "x": 1050,
            "y": 44
        },
        {
            "x": 894,
            "y": 40
        },
        {
            "x": 151,
            "y": 42
        },
        {
            "x": 113,
            "y": 43
        },
        {
            "x": 101,
            "y": 68
        },
        {
            "x": 100,
            "y": 114
        },
        {
            "x": 98,
            "y": 156
        },
        {
            "x": 95,
            "y": 382
        },
        {
            "x": 96,
            "y": 414
        },
        {
            "x": 117,
            "y": 448
        },
        {
            "x": 173,
            "y": 473
        },
        {
            "x": 799,
            "y": 465
        },
        {
            "x": 860,
            "y": 463
        },
        {
            "x": 880,
            "y": 441
        },
        {
            "x": 890,
            "y": 406
        },
        {
            "x": 888,
            "y": 179
        },
        {
            "x": 868,
            "y": 154
        },
        {
            "x": 822,
            "y": 134
        },
        {
            "x": 761,
            "y": 133
        },
        {
            "x": 320,
            "y": 125
        },
        {
            "x": 276,
            "y": 125
        },
        {
            "x": 264,
            "y": 154
        },
        {
            "x": 263,
            "y": 203
        },
        {
            "x": 269,
            "y": 350
        },
        {
            "x": 273,
            "y": 390
        },
        {
            "x": 326,
            "y": 406
        },
        {
            "x": 474,
            "y": 404
        },
        {
            "x": 535,
            "y": 400
        },
        {
            "x": 535,
            "y": 400
        }
    ];
    
    for (const pt of chaikinSmoothing(all)) yield { x: pt.x - 20, y: pt.y + 50 };
  }