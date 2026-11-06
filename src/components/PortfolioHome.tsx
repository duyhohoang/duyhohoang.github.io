'use client';
import { type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { boards } from '@/lib/projects';
import { resumeProjects } from '@/data/resume';
import { portrait, aboutPortrait } from '@/data/portfolio-media';
import { usePortfolioMotion } from '@/hooks/usePortfolioMotion';
import { BoardCatalog } from './BoardCatalog';
import { AnimatedFAQ } from './animation/AnimatedFAQ';
import { AnimatedCounter } from './animation/AnimatedCounter';
import { ContactForm, SendEmail } from './ContactForm';
import { ResumeDownload } from './ResumeDownload';
import { VisionMarquee } from './VisionMarquee';
import { PortfolioSocials } from './PortfolioSocials';
import { TechnicalSkills } from './TechnicalSkills';

export function Heading({label,children,description}:{label:string;children:ReactNode;description?:string}){return <div className="ref-heading"><span>{label}</span><h2>{children}</h2>{description&&<p>{description}</p>}</div>}
export function Action({children,outline=false,href='#contact'}:{children:ReactNode;outline?:boolean;href?:string}){return <Link className={'ref-button'+(outline?' outline':'')} href={href}>{children}</Link>}
export function Socials(){return <PortfolioSocials/>}
const techTools=[
 {name:'KiCad',mark:<><span className="tech-kicad-mark">Ki<i/></span><b>KiCad</b></>},
 {name:'Altium Designer',mark:<><svg className="tech-altium-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 2 34 11v14L18 34 2 25V11z"/><path d="m18 8 10 6v8l-10 6-10-6v-8z"/><path d="m18 14 5 3v4l-5 3-5-3v-4z"/></svg><b>Altium <small>Designer</small></b></>},
 {name:'PCB Toolkit',mark:<><svg className="tech-pcb-mark" viewBox="0 0 36 36" aria-hidden="true"><rect x="5" y="5" width="26" height="26" rx="3"/><path d="M11 12h6v6h-6zm9 0h5m-5 6h5m-14 5h14m-3-11v11m-5-5h9"/></svg><b>PCB Toolkit</b></>},
 {name:'STM32CubeMX',mark:<><svg className="tech-st-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 2 33 10.5v15L18 34 3 25.5v-15z"/><text x="18" y="22" textAnchor="middle">ST</text></svg><b>STM32CubeMX</b></>},
 {name:'Arduino IDE',mark:<><svg className="tech-arduino-mark" viewBox="0 0 40 30" aria-hidden="true"><path d="M20 15C10 1 2 5 2 13s8 12 18 2c10-10 18-7 18 1s-8 12-18-1Z"/><path d="M8 9v6m-3-3h6m21-3v6m-3-3h6"/></svg><b>Arduino IDE</b></>},
 {name:'OpenAI Codex',mark:<><Image className="tech-openai-mark" src="/assets/tech/openai.svg" alt="OpenAI logo" width={34} height={34}/><b>Codex</b></>},
 {name:'Claude Code',mark:<><Image className="tech-claude-mark" src="/assets/tech/claude.png" alt="Claude logo" width={34} height={34}/><b>Claude Code</b></>},
];
function TechStackBar(){return <section className="ref-container ref-trust"><div className="tech-stack-heading"><span>TECHNICAL FOUNDATION</span><h2>The <em>Tech Stack</em> I Use</h2><a href="#technical-skills">↓ &nbsp;View full tech stack <b>→</b></a></div><div className="ref-tools">{techTools.map(tool=><div className="tech-logo" key={tool.name} aria-label={tool.name}>{tool.mark}</div>)}</div><div className="ref-domain-grid">{[["PCB DESIGN","Schematic & layout","2–4 layer board design"],["POWER DESIGN","AC/DC & DC/DC","Power conversion fundamentals"],["EMBEDDED","STM32 & ESP32","Basic C/C++ and interfaces"],["TESTING","Practical tools","Multimeter & oscilloscope"]].map(([label,title,description])=><article key={label}><span>{label}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>}
const educationEntries=[
 {title:'Ho Chi Minh City University of Technology and Engineering',role:'Automation and Control Engineering Technology',period:'Sep 2019 – Sep 2026',details:['Automation Engineering'],icon:'⌂'},
 {title:'3DVisionLab – AIoTSemiconductor',role:'PCB Design Training',period:'Oct 2026',details:['Schematic design and PCB layout'],icon:'⌘'},
];
const experienceEntries=[
 {title:'ST Engineering Solution JSC',role:'Electrical Technician',period:'Apr 2024 – Aug 2025',details:['Wired AHU, FCU and DDC control panels.','Worked with the team to troubleshoot issues.'],icon:'⌁'},
 {title:'Hung Thinh Phat Elevator',role:'Electrical Technician',period:'Sep 2025 – Sep 2026',details:['Installed electrical systems and components.','Wired control panels; troubleshot and serviced elevator faults using electrical diagrams.'],icon:'⌁'},
];
function BackgroundTimeline({entries}:{entries:typeof educationEntries}){return <div className="ref-timeline">{entries.map(entry=><article key={entry.title}><i aria-hidden="true">{entry.icon}</i><h3>{entry.title}</h3><div className="timeline-role"><strong>{entry.role}</strong><span>{entry.period}</span></div><ul>{entry.details.map(detail=><li key={detail}>{detail}</li>)}</ul></article>)}</div>}
export function CaseStudy({index=0}:{index?:number}){const board=resumeProjects[index];return <article className={'ref-case'+(!index?' featured':'')}><div className="ref-tags"><span>{!index?'Featured project':'Personal project'}</span><span>{board.name}</span></div><h3>{board.name}</h3><p className="ref-role">♧ Personal PCB design project</p><p className="ref-period">Project summary</p><h4>THE PROJECT</h4><p>{board.description}</p><h4>PROJECT WORK</h4><ul>{board.features.map(x=><li key={x}>{x}</li>)}</ul><h4>RESULT</h4><div className="ref-results">{board.result.map(x=><div key={x}><strong><AnimatedCounter text={x}/></strong><small>Project result</small></div>)}</div><h4>TOOLS & INTERFACES</h4><div className="ref-tags">{board.techStack.map(x=><span key={x}>{x}</span>)}</div></article>}
export function PortfolioHome(){const motionScope=usePortfolioMotion();return <div className="reference-home" ref={motionScope}>
<section className="ref-hero ref-container circuit-section"><div><div className="ref-available"><i/>PCB Design Portfolio</div><h1>Hello there, welcome to my site. I’m Hoang Duy.</h1><p className="ref-title">PCB Design | Schematic & 2–4 Layer Layout</p><p className="ref-lead">I’m an Automation and Control Engineering Technology graduate focused on PCB design, power supplies, component selection and board layout.</p><div className="ref-highlights"><span><b>PCB Design</b> KiCad & Altium</span><span><b>Power</b> AC/DC · DC/DC</span><span><b>Basic</b> STM32 · ESP32</span></div><blockquote><em>From schematic design and component selection to PCB layout.</em></blockquote><div className="ref-actions"><Action href="#projects">▱ View My Projects</Action><ResumeDownload outline/></div><p className="ref-note">Open to PCB Design Engineering opportunities.</p><Socials/></div><figure className="ref-hero-art"><div className="ref-circle"/><div className="ref-portrait-window"><Image src={portrait.src} width={portrait.width} height={portrait.height} alt={portrait.alt} sizes="(max-width: 799px) 90vw, 520px" loading="eager" fetchPriority="high"/></div></figure></section>
<TechStackBar/>
<section id="case-studies" className="ref-container ref-section"><Heading label="ENGINEERING STUDIES" description="PCB design projects covering industrial power and embedded hardware.">Featured <em>Case Studies</em></Heading><div className="ref-two ref-case-grid"><CaseStudy/><CaseStudy index={1}/></div><div className="ref-strategy"><p>Have a hardware challenge to explore?</p><ResumeDownload/></div></section>
<VisionMarquee/>
<section id="projects" className="ref-container ref-section circuit-section"><Heading label="SELECTED WORK" description="Personal PCB design projects, from schematics to board layout.">Recent <em>Projects</em></Heading><BoardCatalog boards={boards} embedded/></section>
<section id="about" className="ref-container ref-about ref-section"><figure><Image src={aboutPortrait.src} alt={aboutPortrait.alt} width={aboutPortrait.width} height={aboutPortrait.height} sizes="(max-width: 799px) 90vw, 565px"/></figure><div><span className="ref-label">ABOUT ME</span><h2><em>PCB Design</em> & Power Electronics</h2><p>I graduated in Automation and Control Engineering Technology from Ho Chi Minh City University of Technology and Engineering. My main focus is schematic design, component selection and 2–4 layer PCB layout.</p><p className="pink">I work with KiCad and Altium on power conversion and industrial board designs.</p><h4>CORE SKILLS:</h4><ul className="ref-checks"><li>Schematic capture and PCB layout</li><li>AC/DC, DC/DC power supplies and PCB fundamentals</li><li>Component selection, stackup, constraints and routing</li><li>Basic C/C++ and STM32/ESP32 hardware familiarity</li></ul><aside>✧ &nbsp; PCB design training at 3DVisionLab – AIoTSemiconductor.</aside><Socials/></div></section>
<section id="resume" className="ref-container ref-section"><Heading label="ENGINEERING BACKGROUND" description="PCB design training, engineering education and electrical experience.">Education <em>& Experience</em></Heading><div className="background-group"><h3 className="background-group-title">Education</h3><BackgroundTimeline entries={educationEntries}/></div><div className="background-group"><h3 className="background-group-title">Experience</h3><BackgroundTimeline entries={experienceEntries}/></div></section>
<TechnicalSkills/>
<section id="faq" className="ref-container ref-section"><Heading label="QUESTIONS & ANSWERS" description="PCB design tools, board layout and project documentation.">Frequently Asked <em>Questions</em></Heading><div className="ref-faq">{[['Which PCB tools do you use?','KiCad and Altium Designer for schematic capture and PCB layout.'],['What is your PCB design scope?','Schematic design, component selection, 2–4 layer layout, stackup, routing, BOM and manufacturing outputs.'],['What power designs have you worked on?','AC/DC and DC/DC conversion using Buck, Boost and LDO topologies.'],['Do you work with microcontrollers?','I have basic C/C++ and hardware experience with STM32 and ESP32.'],['Which interfaces have you used?','I2C, UART, SPI, CAN, RS232, RS485, Ethernet and USB.'],['What testing tools do you use?','Multimeters and oscilloscopes for practical electrical checks.']].map(([q,a])=><AnimatedFAQ key={q} question={q} answer={a}/>)}</div></section>
<section id="contact" className="ref-container ref-section ref-contact circuit-section"><div><span className="ref-label">GET IN TOUCH</span><h2>Let&apos;s Talk For your <em>Next Project(s)</em></h2><p>Discuss a PCB project or say hello. Explore my <a href="#projects">board designs</a>, <a href="#technical-skills">technical skills</a>, or <a href="#resume">experience.</a></p><ul className="ref-checks"><li>Schematic design and PCB layout</li><li>Power supply and component selection</li><li>Board constraints, routing and BOM</li><li>Basic embedded hardware integration</li></ul><div className="ref-contact-actions"><Socials/><SendEmail/></div></div><ContactForm/></section>
</div>}





