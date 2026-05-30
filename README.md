# Battle Spirit Solo PVE Prototype

This is a first implementation scaffold for a browser-playable Battle Spirit prototype.

## Included now

- Main menu and deck select flow
- Match scene with turn/phase HUD
- Core turn loop: Main -> Attack -> Main2 -> turn switch
- First-turn skip rule for player 1 (skip Core/Attack/Main2)
- Spirit summon with cost reduction by symbols
- Basic attack and block resolution
- Solo AI opponent (heuristic)
- Win by life 0 and deck-out on start step

## Not included yet

- Full Flash timing stack and card-speed interactions
- Nexus/Magic effects and special keywords implementation
- Full Soul Core restrictions and True Release
- Complete rule edge cases from manual

## Run

Use any static server in this folder.

Example with Python:

```bash
cd webapp
python -m http.server 5173
```

Open `http://localhost:5173`.
