import {ReferenceIcon} from './ReferenceIcon';
const skills=[
 {icon:'⌕',title:'PCB Design & Tools',description:'Schematic capture, component placement and PCB layout for personal hardware projects.',tags:['KiCad','Altium Designer','2–4 Layers','Stackup','Constraints','BOM','PCB Toolkit']},
 {icon:'◇',title:'Embedded Platforms',description:'C/C++ firmware and peripheral integration for STM32 and ESP32 hardware.',tags:['STM32','ESP32','C/C++','STM32CubeMX','Arduino IDE','VS Code']},
 {icon:'↔',title:'Communication Interfaces',description:'Industrial communication interfaces and analog or digital signal connections.',tags:['I2C','SPI','UART','CAN','RS232','RS485','USB','4–20 mA']},
 {icon:'▱',title:'Power Supply Design',description:'Power architecture, voltage regulation and distribution for embedded boards.',tags:['AC/DC','Buck','Boost','LDO','Power Distribution']},
 {icon:'◎',title:'IoT & Connectivity',description:'Wireless and wired connectivity for industrial IoT hardware, with LoRa, Wi-Fi, Ethernet and SIM7600/GNSS.',tags:['Ethernet','LoRa','Wi-Fi','4G LTE','SIM7600','GNSS']},
 {icon:'♧',title:'Testing & Design Review',description:'Practical circuit testing and troubleshooting, with attention to return paths and basic signal integrity and EMI/EMC.',tags:['Multimeter','Oscilloscope','Troubleshooting','EMI/EMC']},
];
export function TechnicalSkills(){return <section id="technical-skills" className="ref-container ref-section"><div className="ref-heading"><span>TOOLS & ENGINEERING KNOWLEDGE</span><h2>Technical <em>Skills</em></h2></div><div className="ref-three technical-skills-grid">{skills.map(skill=><article key={skill.title}><span className="ref-icon"><ReferenceIcon symbol={skill.icon}/></span><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-tags">{skill.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div></section>}
