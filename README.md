# bw.tools

Examples of useful integrations of JavaScript in Max.

bw.tools is a Max package by Christopher Biggs and Samuel Wells. It collects a set of abstractions built around the `js` object. Some of them use JavaScript for logic that would be awkward to patch by hand (weighted probability, drunk-walk timing, exponential scaling), and others use JavaScript scripting to build their own internals when the patch loads, so a single object can grow to any number of inlets, outlets, sends, receives, or `playlist~` objects based on its arguments.

Every object ships with a help file, and the JavaScript source is heavily commented, so the package also works as a teaching resource for anyone learning `js` and patcher scripting in Max.

## Requirements

- Max 7 or later
- macOS or Windows

## Download the release

1. Go to the Releases page for this repository: https://github.com/sllewmas/bw.tools/releases
2. Find the latest release (for example, `v1.0.0`).
3. Under **Assets**, download the zip file. If the release only lists "Source code (zip)", download that.
4. Unzip the file.

The unzipped folder may be named something like `bw.tools-1.0.0`. Rename it to `bw.tools` before installing so the folder name matches the package name.

## Install the Max package

1. Quit Max if it is open.
2. Move the `bw.tools` folder into your Max Packages folder:
   - **macOS:** `~/Documents/Max 9/Packages/`
   - **Windows:** `Documents\Max 9\Packages\`

   If you are using an earlier version of Max, use the matching folder instead (for example, `Max 8/Packages`). If the `Packages` folder does not exist, create it.
3. Confirm the folder structure looks like this:

   ```
   Packages/
   └── bw.tools/
       ├── extras/
       ├── help/
       ├── javascript/
       ├── media/
       ├── patchers/
       ├── icon.png
       └── package-info.json
   ```

   The `package-info.json` file must sit directly inside `bw.tools`, not inside a second nested folder.
4. Launch Max.

## Verify the installation

- Open **Extras > bw.tools-overview** from the Max menu bar. This patch lists every object in the package and opens each help file.
- Or create a new patcher, make an object box, and type `bw.scaleExp`. If the object is created without an error, the package is installed. Option-click (macOS) or Alt-click (Windows) the object to open its help file.

## Objects

| Object | Description | Example |
| --- | --- | --- |
| `bw.countEvents` | Counts occurrences of any number of named events. Each event has its own outlet, and the last outlet sends all counts as a list. | `bw.countEvents 6` |
| `bw.cueSystem` | A cue counter for triggering cue numbers from the computer keyboard, MIDI CC, or MIDI notes, with learnable triggers and savable presets. Designed to be loaded in a `bpatcher`. | load in a `bpatcher` |
| `bw.drunkMetro` | A metronome whose speed wanders like the `drunk` object, with separate step sizes and probabilities for speeding up and slowing down. | `bw.drunkMetro 200 100 300 10 20 1.8 0.6 reverse` |
| `bw.playlister` | Scripts any number of `playlist~` objects and loads numbered sound files automatically. Keeps all `playlist~` functionality and integrates with `bw.cueSystem`. | `bw.playlister DIS.wav 3 2` |
| `bw.polyTarget` | Formats `target` messages for `poly~` to address all instances, individual instances through separate inlets, or individual instances from a list. Optional dB-to-amplitude mode. | `bw.polyTarget ind 5` |
| `bw.polyTargetDefer` | Like `bw.polyTarget`, but the message handling runs in JavaScript at low priority. | `bw.polyTargetDefer individual 3 db -35` |
| `bw.randomRange` | Generates one or more random numbers within a range along an exponential curve, as floats or ints. | `bw.randomRange -100 100 0.3 i 4` |
| `bw.randomRangeMetro` | A metronome that bangs at random intervals within a range, shaped by an exponent. | `bw.randomRangeMetro 500 100 500 1.` |
| `bw.scaleExp` | Rescales values with an exponential curve and constrains the output to the output range. | `bw.scaleExp 0 1 0 1 2` |
| `bw.snake` | Creates any number of numbered `send` or `receive` objects from a base name, like a multichannel snake. | `bw.snake s foo 3` |
| `bw.weights` | Triggers events based on weighted probability, in either weights mode or named events mode. | `bw.weights events` |

See each object's help file for full argument and message documentation.

## A note on scripted abstractions

Several objects (`bw.countEvents`, `bw.playlister`, `bw.polyTarget`, `bw.polyTargetDefer`, `bw.randomRange`, `bw.snake`, and `bw.weights`) build their internal objects when they load. Do not open and save these abstractions after they have been instantiated, or the generated objects will be saved into the file and duplicated the next time it loads. Each of these patchers carries a "DO NOT SAVE THIS PATCHER" comment as a reminder.

## Repository layout

- `patchers/` Max abstractions for each object
- `javascript/` the `js` source files used by the abstractions
- `help/` help files for each object
- `extras/` the overview patch that appears in the Max Extras menu
- `media/` sound files, cue presets, and text files used by the help patches

## Authors

Christopher Biggs and Samuel Wells
