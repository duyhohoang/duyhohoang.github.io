export const resumeConfig={url:(process.env.NEXT_PUBLIC_RESUME_URL||'/assets/resume/ho-hoang-duy-cv.pdf?v=20261106').trim(),demo:false};

export const resumeProjects = [
 {name:'IoT Node and Gateway',description:'ESP32-based IoT hardware for sensing, data logging and relay control.',features:['Designed 220 VAC to 24 V, 5 V and 3.3 V power conversion.','Integrated SHT31, RTC, EEPROM and SD card.','Added RS485, Wi-Fi, LoRa and relay control.'],result:['Prototype completed','PCBA completed'],techStack:['KiCad','I2C','RS485','Wi-Fi','LoRa']},
 {name:'Industrial Pump Controller & Data Logger',description:'STM32F407 controller for pump monitoring, VFD control and data logging.',features:['Designed 12 V, 5 V, 4 V, 3.3 V and 1.8 V power rails.','Integrated RTC, EEPROM, SD card, relays and buzzer.','Added CAN, RS485, RS232, Ethernet and SIM7600/GNSS.'],result:['Design completed'],techStack:['KiCad','CAN','RS485','RS232','Ethernet','SIM7600/GNSS']},
];
