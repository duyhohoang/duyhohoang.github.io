## Overview
A MOSFET datasheet describes electrical limits and behavior under specified test conditions. Read the absolute maximum ratings as boundaries, then use the electrical characteristics and graphs to decide whether the device fits the circuit.

> **Warning:** Absolute maximum ratings are stress limits, not recommended operating targets. Allow margin for voltage spikes, temperature and production variation.

![MOSFET symbol and terminal naming](placeholder:components/mosfet-symbol "N-channel and P-channel MOSFET symbols")

## Identify the device and package
Confirm the full ordering code, channel type, package, pinout and temperature grade. Packages with similar shapes may have different pin assignments or thermal characteristics; verify the exact manufacturer data sheet before creating the footprint.

## Important datasheet parameters
| Parameter | What it tells you | How to use it |
| --- | --- | --- |
| VDS maximum | Drain-to-source voltage limit | Keep below the limit with margin for transients |
| VGS maximum | Gate-to-source stress limit | Check gate drive and negative or ringing excursions |
| ID and thermal ratings | Current under stated conditions | Recalculate for the actual copper, airflow and temperature |
| RDS(on) | Conduction loss at a stated gate voltage | Compare at the gate voltage your circuit can provide |
| VGS(th) | Beginning of channel conduction under a small test current | Do not treat it as the voltage for low-resistance switching |
| Qg / Qgd | Charge needed to switch the gate | Consider driver current and switching loss |
| SOA | Safe operating combinations of voltage, current and time | Check linear operation and transient conditions |

## N-channel and P-channel devices
An N-channel MOSFET is commonly used as a low-side switch because its source can be referenced near ground. A high-side N-channel switch generally needs the gate driven above its source. A P-channel MOSFET can simplify some high-side arrangements, with a trade-off in available on-resistance and device choices. The circuit topology determines the appropriate choice.

![MOSFET internal structure placeholder](placeholder:components/mosfet-structure "Conceptual MOSFET channel structure")

## Enhancement and depletion
Enhancement-mode MOSFETs are normally off at zero gate-to-source bias. Depletion-mode devices conduct at zero bias and require a suitable gate bias to reduce or stop conduction. Check the datasheet and symbol conventions rather than inferring mode from package appearance.

## Switching characteristics
Gate charge is often more useful than gate capacitance alone when estimating switching effort. The Miller charge region relates to the drain-voltage transition. The test circuit and gate resistance in the datasheet affect reported switching times, so compare conditions to your driver and load.

```formula
Pconduction ≈ ID² × RDS(on)
Pgate-drive ≈ Qg × Vdrive × fSW
```

These are first-order estimates. Switching overlap, body-diode behavior, reverse recovery, PCB parasitics and thermal conditions may also matter.

## Selecting a MOSFET
1. Determine maximum steady voltage and transient voltage at the device.
2. Confirm the gate drive voltage and logic level under worst-case conditions.
3. Estimate conduction and switching losses for the operating profile.
4. Check safe operating area, avalanche information and thermal path.
5. Verify pinout, footprint, gate resistor needs and protection components.

![Gate charge and switching waveform placeholder](placeholder:components/mosfet-waveform "Gate charge and switching waveform")

## Common mistakes
- Selecting by drain current rating without reading its thermal conditions.
- Using threshold voltage as the gate voltage for a fully enhanced switch.
- Ignoring gate-source maximum ratings or turn-off behavior.
- Assuming nominal RDS(on) applies at every temperature and gate voltage.
- Copying a footprint without checking the exact package drawing.

## Related articles
- [Buck Converter: Operating Principle and Design](../theory/buck-converter.md)
- [Resistor Fundamentals and Applications](resistor-fundamentals.md)
