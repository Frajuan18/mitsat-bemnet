import gsap from 'gsap'

// A single module that assigns GSAP its shared instance. ScrollTrigger is not
// registered here because the scroll-driven scenes are authored with Framer
// Motion's useScroll; GSAP is reserved for time-based choreography (the
// envelope opening timeline).
export { gsap }
export default gsap