## Overview
A buck converter is a switching DC–DC converter that produces a lower average output voltage from a higher input voltage. It transfers energy through an inductor and output capacitor while a semiconductor switch is rapidly turned on and off. Efficiency and component stress depend on the topology, operating conditions, component choices and PCB layout.

> **Engineering note:** The relationships below are ideal, steady-state starting points for a continuous-conduction buck converter. Real designs must account for losses, operating range, controller limits and transient behavior.

![Simplified buck converter schematic](placeholder:theory/buck-converter-schematic "Simplified buck converter schematic")

## What is a buck converter?
The switch connects the input to the inductor for part of each switching period. An asynchronous design uses a diode for the freewheel path; a synchronous design uses a second controlled MOSFET. The inductor and capacitor smooth the pulsed energy into a lower DC output.

## Operating principle
### Switch on
When the high-side switch is on, the inductor sees approximately the input-to-output voltage difference. Inductor current rises and energy is delivered to the load and stored in the magnetic field.

### Switch off
When the high-side switch turns off, inductor current continues through the freewheel path. The inductor voltage reverses, its current falls, and stored energy continues to supply the output.

![Inductor current paths in the on and off intervals](placeholder:theory/buck-current-flow "Current flow during switch on and switch off")

## First-pass continuous-conduction relationships
For an ideal converter in steady state, volt-second balance gives the familiar relationship below. It is useful for intuition and preliminary sizing, not as a substitute for the controller data sheet or a full loss analysis.

```formula
VOUT ≈ D × VIN
ΔIL(on) ≈ (VIN − VOUT) × D / (L × fSW)
ΔIL(off) ≈ VOUT × (1 − D) / (L × fSW)
```

Where `D` is the switch duty ratio, `L` is inductance and `fSW` is switching frequency. The equations assume ideal devices and continuous inductor current.

## Component selection checklist
| Part | First checks | Design follow-up |
| --- | --- | --- |
| Controller / switch | Input range, current limit, switching frequency | Startup, protection and thermal limits |
| Inductor | Saturation current, RMS current, DCR | Ripple, core loss and temperature rise |
| Input capacitor | Ripple current, voltage rating, impedance | Place close to the switching current loop |
| Output capacitor | Ripple, transient response, ESR | Confirm stability against controller guidance |
| Freewheel device | Reverse voltage, current, recovery | Synchronous FET timing or diode loss |

## PCB layout guidelines
Keep the high di/dt input and switching loops compact. Place the input bypass capacitor next to the switch and return pins, keep the switch node copper only as large as needed, and provide a short, low-impedance return path. Separate quiet feedback routing from the switch node and inductor. Check the controller reference layout and current-return paths before optimizing for appearance.

![Switching power stage PCB placement placeholder](placeholder:layout/buck-power-stage "Switching power stage placement and current loop")

## EMI and common design mistakes
Fast voltage and current edges can couple through parasitic capacitance and inductance. A large switch node, long hot loops, poor input decoupling and feedback traces near switching copper can increase noise. Check input filtering, grounding, snubber needs and measurement setup against the actual converter and compliance goals.

- Selecting an inductor only by its nominal inductance and ignoring saturation current.
- Treating the ideal duty-ratio equation as the final output-voltage prediction.
- Routing feedback through or alongside the switch-node region.
- Assuming a larger copper area always improves a noisy switching node.

## Practical design sequence
1. Define input range, output range, load current, startup behavior and thermal limits.
2. Select a controller whose topology and ratings fit those requirements.
3. Follow its recommended inductor, capacitor and compensation calculations.
4. Place the critical power loop first, then route feedback and control signals.
5. Review DRC, current paths and thermal behavior; validate hardware with suitable instruments.

## Related articles
- [PCB Stack-up and Layer Configuration](../layout/pcb-stackup.md)
- [How to Read a MOSFET Datasheet](../components/mosfet-datasheet.md)
- [Resistor Fundamentals and Applications](../components/resistor-fundamentals.md)
