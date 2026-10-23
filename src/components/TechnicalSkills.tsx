import {ReferenceIcon} from './ReferenceIcon';
const skills=[
 {icon:'⌕',title:'PCB Design & Tools',description:'Schematic capture, component placement and PCB layout for personal hardware projects.',tags:['KiCad','Altium Designer','Schematic','PCB Layout']},
 {icon:'◇',title:'Embedded Platforms',description:'Microcontroller hardware, peripheral connections and firmware integration planning.',tags:['STM32','ESP32','GPIO','Peripherals']},
 {icon:'↔',title:'Communication Interfaces',description:'Industrial communication interfaces and analog or digital signal connections.',tags:['CAN','RS485','ADC','Digital I/O']},
 {icon:'▱',title:'Power Supply Design',description:'Power architecture, voltage regulation and distribution for embedded boards.',tags:['DC/DC','LDO','Power Distribution']},
 {icon:'◎',title:'IoT & Connectivity',description:'Connected hardware concepts for remote monitoring, telemetry and control.',tags:['Ethernet','Cellular','Monitoring','Data Logging']},
 {icon:'♧',title:'Design Documentation',description:'Clear schematics, interface notes and manufacturing deliverable planning.',tags:['BOM','Gerbers','Design Review','Documentation']},
];
export function TechnicalSkills(){return <section id="technical-skills" className="ref-container ref-section"><div className="ref-heading"><span>TOOLS & ENGINEERING KNOWLEDGE</span><h2>Technical <em>Skills</em></h2></div><div className="ref-three technical-skills-grid">{skills.map(skill=><article key={skill.title}><span className="ref-icon"><ReferenceIcon symbol={skill.icon}/></span><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-tags">{skill.tags.map(tag=><span key={tag}>{tag}</span>)}</div></article>)}</div></section>}
