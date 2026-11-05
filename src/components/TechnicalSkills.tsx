import {ReferenceIcon} from './ReferenceIcon';
const skills=[
 {icon:'⌕',title:'PCB Design & Tools',description:'Schematic design, component selection and 2–4 layer PCB layout.',tags:['KiCad','Altium','PCB Toolkit','Stackup','Routing','BOM']},
 {icon:'▱',title:'Power Supply Design',description:'AC/DC and DC/DC supply fundamentals and power conversion.',tags:['AC/DC','Buck','Boost','LDO','Power Rails']},
 {icon:'↔',title:'Communication Interfaces',description:'Industrial and board-level communication protocols.',tags:['I2C','SPI','UART','CAN Bus','RS232','RS485','Ethernet','USB']},
 {icon:'♧',title:'Testing & Design Review',description:'Hands-on electrical testing and troubleshooting.',tags:['Multimeter','Oscilloscope','Troubleshooting']},
 {icon:'◎',title:'IoT & Connectivity',description:'Wired and wireless connectivity used across board projects.',tags:['Ethernet','LoRa','Wi-Fi','4G','GNSS']},
 {icon:'◇',title:'Embedded Fundamentals',description:'Basic C/C++ and familiarity with STM32 and ESP32 hardware.',tags:['STM32','ESP32','C/C++','STM32CubeMX','Arduino IDE']},
];
export function TechnicalSkills(){return <section id="technical-skills" className="ref-container ref-section"><div className="ref-heading"><span>TOOLS & ENGINEERING KNOWLEDGE</span><h2>Technical <em>Skills</em></h2></div><div className="ref-three technical-skills-grid">{skills.map(skill=><article key={skill.title}><span className="ref-icon"><ReferenceIcon symbol={skill.icon}/></span><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-tags">{skill.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div></section>}
