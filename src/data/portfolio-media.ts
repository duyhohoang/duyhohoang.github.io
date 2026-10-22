/** Replace these local files to supply owner-approved photography and project visuals. */
export const portrait = {
  src: '/assets/portraits/hoang-duy.webp',
  alt: 'Hoàng Duy with folded arms, monochrome portrait based on the supplied photograph',
  width: 1024,
  height: 1536,
  caption: 'Hoàng Duy · PCB Design, Embedded Systems & IoT',
};
export const aboutPortrait = {...portrait, src: '/assets/portraits/hoang-duy-about.webp', alt: 'Hoàng Duy smiling and giving a thumbs-up, monochrome portrait based on the supplied photograph'};
export const projectIllustrations: Record<string, string> = {
  controller: '/assets/projects/iot-controller.webp',
  io: '/assets/projects/io-platform.webp',
  fan: '/assets/projects/fan-controller.webp',
};
export const workflowImages: Record<string, {src:string;alt:string}> = {
  layout: {src:'/assets/tools/kicad-pcb-editor.png',alt:'User-supplied KiCad PCB editor screenshot, illustrating the layout workflow'},
  schematics: {src:'/assets/tools/altium-designer.jpg',alt:'User-supplied Altium Designer image, illustrating the design environment'},
  bom: {src:'/assets/projects/io-platform.webp',alt:'Illustrative embedded board showing component selection and assembly detail'},
};
