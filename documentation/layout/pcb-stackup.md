## Overview
A PCB stack-up defines the order and thickness of copper and insulating layers. It affects routing options, return paths, impedance, board thickness, manufacturability and cost. The final stack-up should be agreed with the board fabricator and tied to actual design requirements.

> **Design note:** Example layer names below describe a generic four-copper-layer arrangement. They are not manufacturing specifications for a particular board.

![Four-layer PCB stack-up placeholder](placeholder:layout/four-layer-stackup "Four-layer PCB copper and dielectric arrangement")

## What makes up a stack-up?
Copper layers carry signals, power or reference planes. Dielectric layers insulate copper and establish spacing; common constructions use core and prepreg materials. Solder mask and silkscreen sit outside the copper stack and are described separately in fabrication data.

## Example four-layer arrangement
| Order | Layer | Typical role |
| --- | --- | --- |
| 1 | Top copper | Components, signals and local power routing |
| 2 | Inner copper 1 | Continuous reference plane where practical |
| 3 | Inner copper 2 | Power distribution and/or routed signals |
| 4 | Bottom copper | Signals, components and ground returns |

The arrangement is illustrative. Whether an inner layer is ground, power or signal depends on the board and the fabricator's construction options.

![Return path across PCB reference layers placeholder](placeholder:layout/return-path-stackup "Signal and return path through a multilayer board")

## Return paths and layer transitions
High-frequency return current tends to flow near the signal path on a nearby reference plane. A signal via that changes reference layers may need a nearby stitching via or another deliberate return-path transition. Splits, gaps and plane cutouts can force current to detour and increase loop area.

## Thickness and copper weight
Overall thickness is the sum of copper, dielectric, mask and finish contributions according to the manufacturing stack-up. Copper thickness affects resistance and current handling, but trace width, temperature rise, copper distribution and fabrication tolerances also matter. Use the fabricator's actual available constructions for controlled impedance work.

## Choosing a layer configuration
- **Two layers:** simpler and often lower cost; requires careful routing and return-path planning.
- **Four layers:** provides more routing capacity and can support continuous internal reference planes.
- **More layers:** may help dense routing, high-speed interfaces or reference-plane continuity, with added cost and manufacturing complexity.

## Layout review checklist
1. Confirm board thickness, copper weights, dielectric materials and tolerances with the fabricator.
2. Keep high-speed signals adjacent to a continuous reference plane where possible.
3. Avoid routing across reference-plane splits.
4. Check return paths at every signal-layer transition.
5. Verify impedance requirements using the fabricator's stack-up calculator or field solver.
6. Document the approved stack-up in the fabrication package.

## Related articles
- [Buck Converter: Operating Principle and Design](../theory/buck-converter.md)
- [How to Read a MOSFET Datasheet](../components/mosfet-datasheet.md)
