## Goals
- build a top-down racing game because it's fun
- just add multiplayer1!
- add online leaderboard with laptimes

## Features
- single player free practice (no ai either)
- 4 car skins
- 7 real-world racetracks
- fuel consumption and refueling pit stops
- lap times including fastest lap
- dust clouds, yellow flag when going off track
- clouds in the sky rotating around the world center point (dat realism)

## Installation
- clone this repo
- run it on a webserver (ie, run `python3 -m http.server` in the checkout folder and open [http://localhost:8000](http://localhost:8000) in a browser)

## Game engine
This is based off of a simple tutorial about moving a character on a plane. 
I took that and inverted some logic to make the world move around the player. 
Next step was to create a system that can determine wether a player is on track or off track. 
I solved this by analyzing the pixel color the player('s centerpoint) is currently sitting on top of.
The tracks are layers svg files all based off of Wikipedia svg files of the racetracks. 
One layer, `#path`, will contain a bright-colored version of the track as well as other surfaces such as pit lane, pit box area, all in their own distinct color.
Other layers, `#world`, `#track` and `#elevated` will all contain artwork that is layered on top or below the `#path` layer and do not affect the car behavior in any way.


## Contribute 
Want to contribute? 
- development: javascript 
- design: decent knowledge of [Inkscape](https://www.inkscape.org) and a little bit of knowledge of its xml/css editor(s)
- checkout [the current issues](https://github.com/ikbensiep/game1/issues) or [project board](https://github.com/ikbensiep/game1/projects/1)

## race gaem 1
this is my first game ever, so please excuse the duct-tape-y look on some of the code lol

[demo](http://ikbensiep.github.io/game1)
