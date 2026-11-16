## Overview
A resistor limits or senses current, establishes voltage relationships, sets bias conditions and provides loads or terminations. Its resistance alone is not enough for selection: power, tolerance, temperature behavior, voltage stress, pulse capability and package all matter.

![Resistor symbol and common package placeholder](placeholder:components/resistor-symbol "Resistor circuit symbol and package examples")

## Resistance and basic relationships
For a resistor under the usual lumped-circuit assumption, Ohm's law relates voltage, current and resistance. Dissipated power can be estimated from the same quantities.

```formula
V = I × R
P = V × I = I² × R = V² / R
```

The actual component must remain within the manufacturer's derated operating limits.

## Common applications
- **Current limiting:** Set a bounded current, for example in an LED path.
- **Voltage divider:** Generate a lower voltage for a high-impedance input.
- **Pull-up / pull-down:** Define a logic input state when no active driver is present.
- **Current sensing:** Create a small measurable voltage drop with a suitable low-value part.
- **Termination or damping:** Reduce reflections or ringing when designed for the interface.

![Voltage divider schematic placeholder](placeholder:components/resistor-voltage-divider "Two-resistor voltage divider circuit")

For an unloaded divider, the output relationship is:

```formula
VOUT = VIN × R2 / (R1 + R2)
```

A connected load changes the effective lower resistance and therefore the output voltage. Check input range, source impedance, divider current and resistor dissipation.

## Selection parameters
| Parameter | Design question |
| --- | --- |
| Resistance | Does it meet the electrical function across tolerance? |
| Power rating | Is dissipation within the derated rating at board temperature? |
| Tolerance | How much variation can the circuit accept? |
| TCR | Does resistance drift with temperature affect accuracy? |
| Voltage rating | Is working voltage within the part's limit? |
| Pulse / surge rating | Can the resistor handle startup, fault or transient energy? |
| Package | Does size, assembly process and spacing fit the board? |

## Practical design checks
Choose the next standard value only after checking worst-case tolerance. For a current-sense resistor, consider both its voltage drop and self-heating. For high-value dividers, include input leakage and noise sensitivity. For power resistors, check the datasheet's derating curve and PCB thermal conditions.

## Common mistakes
- Calculating power only at nominal voltage instead of the worst-case input.
- Ignoring resistor tolerance in thresholds and feedback networks.
- Using a divider on an input that draws significant current without recalculating it.
- Treating package power rating as independent of copper area and ambient temperature.
- Forgetting voltage, pulse and creepage requirements in high-voltage circuits.

## Related articles
- [How to Read a MOSFET Datasheet](mosfet-datasheet.md)
- [Buck Converter: Operating Principle and Design](../theory/buck-converter.md)
