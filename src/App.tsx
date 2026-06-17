import { useState, useEffect, useRef, useCallback, useDeferredValue } from 'react'
import {
  motion,
  AnimatePresence,
  usePresence,
} from 'motion/react'
import {
  ArrowRight,
  Plus,
  Bone,
  Dna,
  Gem,
  Leaf,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
  Search,
  Moon,
  Sun,
} from 'lucide-react'

/* ============================================================
   DATA
   ============================================================ */

const chaptersData = [
  { name: 'Age of Dinosaurs', image: 'https://cdn.pixabay.com/photo/2025/11/12/09/09/dinosaur-9952361_1280.jpg' },
  { name: 'Fossils of Ancient Life', image: 'https://cdn.pixabay.com/photo/2014/06/12/19/41/museum-367730_1280.jpg' },
  { name: 'Reptiles of the Mesozoic', image: 'https://cdn.pixabay.com/photo/2012/04/02/15/18/stegosaurus-24752_1280.png' },
  { name: 'Marine Fossil Gallery', image: 'https://cdn.pixabay.com/photo/2013/07/13/13/39/fossil-161292_1280.png' },
  { name: 'Prehistoric Giants', image: 'https://cdn.pixabay.com/photo/2023/10/23/20/26/dinosaur-oil-painting-8336921_1280.png' },
]

const dinosaurList = [
  'Tyrannosaurus', 'Triceratops', 'Stegosaurus', 'Velociraptor',
  'Brachiosaurus', 'Pterodactyl', 'Diplodocus', 'Ankylosaurus',
  'Parasaurolophus', 'Spinosaurus', 'Allosaurus', 'Pachycephalosaurus',
  'Iguanodon', 'Corythosaurus', 'Deinonychus', 'Gallimimus',
  'Oviraptor', 'Protoceratops', 'Therizinosaurus', 'Carnotaurus',
  'Dilophosaurus', 'Mosasaurus', 'Plesiosaurus', 'Pteranodon',
  'Archaeopteryx', 'Compsognathus', 'Herrerasaurus', 'Maiasaura',
  'Styracosaurus', 'Apatosaurus', 'Baryonyx', 'Caudipteryx',
  'Coelophysis', 'Crocodylomorpha', 'Dimetrodon', 'Edmontonia',
  'Giganotosaurus', 'Hypsilophodon', 'Kentrosaurus', 'Lambeosaurus',
  'Microraptor', 'Minmi', 'Monolophosaurus', 'Ouranosaurus',
  'Plateosaurus', 'Psittacosaurus', 'Sauropelta', 'Segnosaurus',
  'Shunosaurus', 'Suchomimus',
]

const dinoFallback: Record<string, { description: string; era: string; diet?: string; length?: string; weight?: string }> = {
  Tyrannosaurus: { description: 'One of the largest land carnivores of all time, T. rex roamed western North America during the late Cretaceous period.', era: 'Late Cretaceous (68-66 mya)', diet: 'Carnivore', length: '12.3 m', weight: '8,000 kg' },
  Triceratops: { description: 'A large ceratopsian dinosaur with three distinctive facial horns and a large bony frill.', era: 'Late Cretaceous (68-66 mya)', diet: 'Herbivore', length: '9 m', weight: '6,000 kg' },
  Stegosaurus: { description: 'A herbivorous dinosaur known for its double row of kite-shaped plates along its back and spiked tail.', era: 'Late Jurassic (155-150 mya)', diet: 'Herbivore', length: '9 m', weight: '5,000 kg' },
  Velociraptor: { description: 'A small dromaeosaurid dinosaur, no larger than a turkey, known for its sickle-shaped claw on each foot.', era: 'Late Cretaceous (75-71 mya)', diet: 'Carnivore', length: '2 m', weight: '15 kg' },
  Brachiosaurus: { description: 'A massive sauropod dinosaur with an incredibly long neck, reaching heights of up to 13 meters.', era: 'Late Jurassic (154-150 mya)', diet: 'Herbivore', length: '25 m', weight: '35,000 kg' },
  Pterodactyl: { description: 'A genus of pterosaur with elongated jaws and a wingspan reaching over 1 meter.', era: 'Late Jurassic (150-148 mya)', diet: 'Carnivore', length: '1 m', weight: '2 kg' },
  Diplodocus: { description: 'An extremely long sauropod dinosaur with a distinctive whip-like tail and peg-like teeth.', era: 'Late Jurassic (154-150 mya)', diet: 'Herbivore', length: '27 m', weight: '15,000 kg' },
  Ankylosaurus: { description: 'A heavily armored dinosaur with a large club at the end of its tail for defense.', era: 'Late Cretaceous (68-66 mya)', diet: 'Herbivore', length: '8 m', weight: '6,000 kg' },
  Parasaurolophus: { description: 'A hadrosaurid dinosaur with an elaborate cranial crest forming a long curved tube.', era: 'Late Cretaceous (76-73 mya)', diet: 'Herbivore', length: '10 m', weight: '3,500 kg' },
  Spinosaurus: { description: 'The largest known carnivorous dinosaur, even bigger than T. rex, with a distinctive sail on its back.', era: 'Late Cretaceous (99-94 mya)', diet: 'Carnivore', length: '15 m', weight: '7,500 kg' },
  Allosaurus: { description: 'The apex predator of the Late Jurassic, with large powerful hind limbs and sharp serrated teeth.', era: 'Late Jurassic (155-145 mya)', diet: 'Carnivore', length: '9.5 m', weight: '2,500 kg' },
  Pachycephalosaurus: { description: 'A dome-headed dinosaur with an extremely thick skull used for head-butting contests.', era: 'Late Cretaceous (70-66 mya)', diet: 'Herbivore', length: '4.5 m', weight: '450 kg' },
  Iguanodon: { description: 'A bulky herbivorous dinosaur with a distinctive thumb spike, one of the first dinosaurs ever discovered.', era: 'Early Cretaceous (140-125 mya)', diet: 'Herbivore', length: '10 m', weight: '4,500 kg' },
  Corythosaurus: { description: 'A duck-billed dinosaur with a tall helmet-like crest used for communication.', era: 'Late Cretaceous (77-75 mya)', diet: 'Herbivore', length: '9 m', weight: '4,000 kg' },
  Deinonychus: { description: 'A wolf-sized dromaeosaurid that helped revolutionize our understanding of dinosaur behavior as active predators.', era: 'Early Cretaceous (115-108 mya)', diet: 'Carnivore', length: '3.4 m', weight: '80 kg' },
  Gallimimus: { description: 'An ostrich-like ornithomimid dinosaur with long legs built for speed.', era: 'Late Cretaceous (72-66 mya)', diet: 'Omnivore', length: '6 m', weight: '440 kg' },
  Oviraptor: { description: 'A bird-like dinosaur known for brooding its eggs, challenging earlier beliefs about its diet.', era: 'Late Cretaceous (75-71 mya)', diet: 'Omnivore', length: '2 m', weight: '35 kg' },
  Protoceratops: { description: 'A small ceratopsian dinosaur that lived in herds and is known from numerous well-preserved fossils.', era: 'Late Cretaceous (75-70 mya)', diet: 'Herbivore', length: '2 m', weight: '180 kg' },
  Therizinosaurus: { description: 'A bizarre theropod with enormous three-foot-long claws that likely used them for gathering plants.', era: 'Late Cretaceous (70-66 mya)', diet: 'Herbivore', length: '10 m', weight: '5,000 kg' },
  Carnotaurus: { description: 'A horned carnivorous dinosaur with distinctive bull-like horns above its eyes and extremely short arms.', era: 'Late Cretaceous (72-66 mya)', diet: 'Carnivore', length: '9 m', weight: '2,100 kg' },
  Dilophosaurus: { description: 'A crested carnivore from the Early Jurassic, recognized by its paired crests on the skull.', era: 'Early Jurassic (193-183 mya)', diet: 'Carnivore', length: '6 m', weight: '500 kg' },
  Mosasaurus: { description: 'A massive marine reptile that dominated the late Cretaceous oceans, reaching lengths of 15 meters.', era: 'Late Cretaceous (82-66 mya)', diet: 'Carnivore', length: '15 m', weight: '14,000 kg' },
  Plesiosaurus: { description: 'A long-necked marine reptile with four flippers that swam the Jurassic seas.', era: 'Early Jurassic (199-175 mya)', diet: 'Carnivore', length: '3.5 m', weight: '450 kg' },
  Pteranodon: { description: 'A large pterosaur with a wingspan of up to 7 meters and a distinctive crest on its head.', era: 'Late Cretaceous (86-84 mya)', diet: 'Carnivore', length: '1.8 m', weight: '25 kg' },
  Archaeopteryx: { description: 'A feathered dinosaur that is considered a transitional fossil between dinosaurs and modern birds.', era: 'Late Jurassic (150-145 mya)', diet: 'Carnivore', length: '0.5 m', weight: '1 kg' },
  Compsognathus: { description: 'One of the smallest known dinosaurs, about the size of a chicken, from the Late Jurassic of Europe.', era: 'Late Jurassic (150-145 mya)', diet: 'Carnivore', length: '1 m', weight: '3 kg' },
  Herrerasaurus: { description: 'One of the oldest known dinosaurs, providing crucial insight into early dinosaur evolution.', era: 'Late Triassic (231-228 mya)', diet: 'Carnivore', length: '5 m', weight: '350 kg' },
  Maiasaura: { description: 'A duck-billed dinosaur known as a "good mother lizard" due to extensive fossil evidence of parental care.', era: 'Late Cretaceous (77-76 mya)', diet: 'Herbivore', length: '9 m', weight: '4,000 kg' },
  Styracosaurus: { description: 'A ceratopsian dinosaur with a spiked frill and a single large horn on its nose.', era: 'Late Cretaceous (76-75 mya)', diet: 'Herbivore', length: '5.5 m', weight: '2,700 kg' },
  Apatosaurus: { description: 'One of the largest land animals ever, formerly known as Brontosaurus, with a long neck and whip-like tail.', era: 'Late Jurassic (154-150 mya)', diet: 'Herbivore', length: '22 m', weight: '25,000 kg' },
  Baryonyx: { description: 'A fish-eating spinosaurid with a distinctive crocodile-like snout and large curved claws.', era: 'Early Cretaceous (130-125 mya)', diet: 'Carnivore', length: '9 m', weight: '2,000 kg' },
  Giganotosaurus: { description: 'One of the largest meat-eating dinosaurs, rivaling T. rex in size, from South America.', era: 'Late Cretaceous (99-95 mya)', diet: 'Carnivore', length: '13 m', weight: '7,000 kg' },
  Coelophysis: { description: 'A small, slender-bodied dinosaur from the Triassic period known from hundreds of fossil specimens.', era: 'Late Triassic (203-196 mya)', diet: 'Carnivore', length: '3 m', weight: '30 kg' },
  Dimetrodon: { description: 'A synapsid with a distinctive sail on its back, often mistaken for a dinosaur, living before the dinosaurs.', era: 'Early Permian (295-270 mya)', diet: 'Carnivore', length: '3.5 m', weight: '250 kg' },
  Microraptor: { description: 'A tiny four-winged feathered dinosaur that could glide between trees in the Early Cretaceous.', era: 'Early Cretaceous (125-120 mya)', diet: 'Carnivore', length: '0.8 m', weight: '1 kg' },
  Kentrosaurus: { description: 'A stegosaurid with plates and spikes along its back and a formidable pair of spikes on its tail.', era: 'Late Jurassic (155-150 mya)', diet: 'Herbivore', length: '5 m', weight: '1,500 kg' },
  Lambeosaurus: { description: 'A hadrosaur with a distinctive hatchet-shaped hollow crest used for vocalization.', era: 'Late Cretaceous (76-75 mya)', diet: 'Herbivore', length: '9 m', weight: '3,500 kg' },
  Ouranosaurus: { description: 'An unusual iguanodont with a tall sail-like structure on its back supported by elongated spines.', era: 'Early Cretaceous (125-112 mya)', diet: 'Herbivore', length: '8 m', weight: '4,000 kg' },
  Plateosaurus: { description: 'An early sauropodomorph dinosaur, one of the first large plant-eating dinosaurs.', era: 'Late Triassic (214-204 mya)', diet: 'Herbivore', length: '8 m', weight: '1,500 kg' },
  Suchomimus: { description: 'A large spinosaurid with a crocodile-like snout, hunting fish in what was once a river delta.', era: 'Early Cretaceous (125-112 mya)', diet: 'Carnivore', length: '11 m', weight: '5,000 kg' },
  Minmi: { description: 'A small ankylosaurian dinosaur from Australia, one of the few known from the continent, with light armor plating.', era: 'Early Cretaceous (120-112 mya)', diet: 'Herbivore', length: '3 m', weight: '300 kg' },
  Caudipteryx: { description: 'A small peacock-sized feathered dinosaur with a fan of tail feathers, closely related to birds.', era: 'Early Cretaceous (125-120 mya)', diet: 'Omnivore', length: '0.8 m', weight: '4 kg' },
  Crocodylomorpha: { description: 'An ancient group of archosaurs that includes modern crocodiles and their extinct relatives from the Mesozoic.', era: 'Late Triassic (230-200 mya)', diet: 'Carnivore', length: '2-6 m', weight: '100-1,000 kg' },
  Edmontonia: { description: 'A large nodosaurid ankylosaur with prominent shoulder spikes and heavy body armor.', era: 'Late Cretaceous (76-66 mya)', diet: 'Herbivore', length: '7 m', weight: '3,000 kg' },
  Hypsilophodon: { description: 'A small bipedal herbivorous dinosaur known for its agility and running speed.', era: 'Early Cretaceous (130-125 mya)', diet: 'Herbivore', length: '2 m', weight: '20 kg' },
  Monolophosaurus: { description: 'A medium-sized theropod dinosaur with a distinctive single crest running along its snout.', era: 'Middle Jurassic (170-164 mya)', diet: 'Carnivore', length: '5.5 m', weight: '500 kg' },
  Psittacosaurus: { description: 'A small early ceratopsian dinosaur with a parrot-like beak, known from hundreds of fossils.', era: 'Early Cretaceous (126-101 mya)', diet: 'Herbivore', length: '2 m', weight: '20 kg' },
  Sauropelta: { description: 'A heavily armored nodosaur with a long tail and distinctive shoulder spikes for defense.', era: 'Early Cretaceous (115-105 mya)', diet: 'Herbivore', length: '5.5 m', weight: '2,000 kg' },
  Segnosaurus: { description: 'A enigmatic therizinosaurid dinosaur with long claws and a pot-bellied herbivorous build.', era: 'Late Cretaceous (96-86 mya)', diet: 'Herbivore', length: '8 m', weight: '4,000 kg' },
  Shunosaurus: { description: 'A unique sauropod dinosaur with a tail club made of fused vertebrae for defense.', era: 'Middle Jurassic (170-160 mya)', diet: 'Herbivore', length: '10 m', weight: '5,000 kg' },
}

interface DinoData {
  name: string
  image: string
  description: string
  era: string
  link: string
  diet?: string
  length?: string
  weight?: string
}

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const cbEase: [number, number, number, number] = [0.16, 1, 0.3, 1]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const letterBlock: any = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: cbEase },
  },
}

/* ============================================================
   SANDPAPER / DISSOLVE IMAGE COMPONENT
   ============================================================ */

function SandTransitionImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isPresent, safeToRemove] = usePresence()
  const filterId = useRef(`sand-${Math.random().toString(36).slice(2, 9)}`).current
  const progressRef = useRef(0)
  const frameRef = useRef<number>(0)
  const divRef = useRef<HTMLDivElement>(null)

  const animate = useCallback(() => {
    const el = divRef.current
    if (!el) return
    const start = performance.now()
    const duration = 900

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = isPresent
        ? 1 - Math.pow(1 - t, 4)
        : Math.pow(t, 3)

      progressRef.current = eased
      const dispScale = eased * 150
      const dy = isPresent ? -eased * 80 : eased * 120
      const dx = (Math.random() - 0.5) * eased * 60
      const blur = eased * 6
      const opacity = Math.max(0, 1 - eased * 1.2)

      const filter = `url(#${filterId})`
      const style = `filter:${filter};opacity:${opacity};`
      el.setAttribute('style', style)

      const feImg = el.querySelector('feDisplacementMap')
      if (feImg) feImg.setAttribute('scale', String(dispScale))
      const feOff = el.querySelector('feOffset')
      if (feOff) {
        feOff.setAttribute('dy', String(dy))
        feOff.setAttribute('dx', String(dx))
      }
      const feBlur = el.querySelector('feGaussianBlur')
      if (feBlur) feBlur.setAttribute('stdDeviation', String(blur))
      const feColor = el.querySelector('feColorMatrix')
      if (feColor) feColor.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${opacity} 0`)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else if (!isPresent && safeToRemove) {
        safeToRemove()
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isPresent, safeToRemove, filterId])

  useEffect(() => {
    const cleanup = animate()
    return () => { if (cleanup) cleanup() }
  }, [animate])

  return (
    <div ref={divRef} className={className}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.8"
            numOctaves="4"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feOffset in="displaced" dx="0" dy="0" result="offset" />
          <feGaussianBlur in="offset" stdDeviation="0" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain"
      />
    </div>
  )
}

/* ============================================================
   NHM LOGO (inline SVG with letter animations)
   ============================================================ */

function NHMLogo() {
  const polygonAttrs = { fill: 'currentColor' }

  const R = (
    <g transform="translate(0,0)">
      <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="14,0 130,0 130,14 14,14" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="116,14 130,14 130,55 116,55" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="14,55 30,55 155,100 139,100" {...polygonAttrs} />
    </g>
  )

  const H = (
    <g transform="translate(280,0)">
      <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="14,43 200,43 200,57 14,57" {...polygonAttrs} />
    </g>
  )

  const M = (
    <g transform="translate(560,0)">
      <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="266,0 280,0 280,100 266,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="0,0 26,0 153,100 127,100" {...polygonAttrs} />
      <motion.polygon variants={letterBlock} points="254,0 280,0 153,100 127,100" {...polygonAttrs} />
    </g>
  )

  return (
    <motion.h1
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
      className="w-full"
    >
      <svg viewBox="0 0 840 100" className="fill-[#111] dark:fill-[#f5f5f5] w-full max-w-[300px] md:max-w-none">
        {R}{H}{M}
      </svg>
    </motion.h1>
  )
}

/* ============================================================
   SUB-HEADER / NAV
   ============================================================ */

function SubNav({ isMobileMenuOpen, setIsMobileMenuOpen }: {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (v: boolean) => void
}) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'Explore', target: 'explore' },
    { label: 'Collection', target: 'collection' },
    { label: 'Safari', target: 'safari' },
    { label: 'About', target: 'about' },
  ]

  return (
    <motion.div
      variants={{
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
      }}
      initial="initial"
      animate="animate"
      className="flex justify-between items-start mt-8"
    >
      {/* Left */}
      <motion.div variants={fadeUp} className="w-[15%] hidden md:block">
        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase leading-relaxed">
          <div>Rachit's</div>
          <div>Historical</div>
          <div>Museum</div>
        </div>
      </motion.div>

      {/* Arrow 1 */}
      <motion.div variants={fadeUp} className="hidden md:flex w-[5%] justify-center pt-1">
        <ArrowRight size={14} strokeWidth={1} className="text-gray-400 dark:text-gray-500" />
      </motion.div>

      {/* Center */}
      <motion.div variants={fadeUp} className="flex-1 md:w-[30%]">
        <p className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase text-gray-800 dark:text-gray-200 leading-relaxed">
          <span className="hidden md:inline">
            Rachit's Historical Museum<br />
            Preserving Earth's ancient<br />
            wonders since 2026.
          </span>
          <span className="md:hidden">
            Rachit's Historical<br />
            Museum — Preserving<br />
            Earth's ancient<br />
            wonders since 2026.
          </span>
        </p>
      </motion.div>

      {/* Arrow 2 */}
      <motion.div variants={fadeUp} className="hidden md:flex w-[5%] justify-center pt-1">
        <ArrowRight size={14} strokeWidth={1} className="text-gray-400 dark:text-gray-500" />
      </motion.div>

      {/* Right */}
      <motion.div variants={fadeUp} className="hidden md:flex w-[15%]">
        <ul className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase space-y-1.5">
          {navLinks.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => l.target && scrollTo(l.target)}
                className="text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white hover:underline transition-colors duration-300 bg-transparent border-none cursor-pointer p-0 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Hamburger */}
      <motion.div variants={fadeUp} className="md:hidden z-60">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex flex-col gap-[6px] p-2 group"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="w-8 h-[1.5px] bg-black dark:bg-white block transition-all duration-300 origin-center"
          />
          <motion.span
            animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="w-8 h-[1.5px] bg-black dark:bg-white block transition-all duration-300 origin-center"
          />
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ============================================================
   MOBILE MENU
   ============================================================ */

function MobileMenu({ isOpen }: { isOpen: boolean }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const links = [
    { label: 'Home', target: 'hero' },
    { label: 'Explore', target: 'explore' },
    { label: 'Collection', target: 'collection' },
    { label: 'Safari', target: 'safari' },
    { label: 'About', target: 'about' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#fcfcfc] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-black/50 md:hidden absolute top-full left-0 w-full z-50"
        >
          <ul className="px-6 py-8 space-y-6">
            {links.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => l.target && scrollTo(l.target)}
                  className="text-sm font-mono tracking-[0.2em] uppercase text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   EXPLORE NOW BUTTON
   ============================================================ */

function ExploreButton() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.button
      onClick={() => scrollTo('explore')}
      whileHover={{ y: -0.5 }}
      whileTap={{ y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' }}
      className="relative overflow-hidden bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm group cursor-pointer"
    >
      <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <span className="relative z-10 flex items-center gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white group-hover:text-[#111] group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1 transition-all duration-500"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
          <path d="M2 17l10 5 10-5" fill="currentColor" />
          <path d="M2 12l10 5 10-5" fill="currentColor" />
          <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="text-[15px] font-medium text-white group-hover:text-[#111] transition-colors duration-500">
          Explore Now
        </span>
      </span>
    </motion.button>
  )
}

/* ============================================================
   DARK MODE TOGGLE
   ============================================================ */

function DarkModeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center w-11 h-11 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 shadow-lg dark:shadow-black/30 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:shadow-xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
      aria-label="Toggle dark mode"
    >
      <motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
      </motion.div>
    </button>
  )
}

/* ============================================================
   SECTION 1: HERO
   ============================================================ */

function HeroSection({ showVideo }: { showVideo: boolean }) {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background video */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://cdn.pixabay.com/video/2015/11/28/1438-147170157_medium.mp4"
                type="video/mp4"
              />
            </video>
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent dark:from-black/70 dark:via-black/40 dark:to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left sidebar */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
        className="relative px-10 md:px-16 mt-20 sm:mt-28 md:mt-32 w-[320px] z-10"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-gray-500 dark:text-gray-300">01</span>
          <span className="w-16 h-[1.5px] bg-black/20 dark:bg-white/20" />
        </motion.div>

        <motion.h2 variants={fadeUp} className="text-[3.5rem] md:text-[5rem] font-normal tracking-tight leading-[1] text-[#111] dark:text-white">
          TIMELESS<br />WONDERS
        </motion.h2>

        <motion.p variants={fadeUp} className="text-[13px] md:text-[14px] text-gray-700 dark:text-gray-200 w-[240px] leading-[1.6] mt-6">
          Step into the prehistoric world<br />
          and uncover the stories of<br />
        dinosaurs written millions<br />
          of years ago.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8">
          <ExploreButton />
        </motion.div>
      </motion.div>

      {/* Right sidebar */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
        className="absolute right-0 top-[30%] w-[200px] mt-12 md:mt-20 hidden md:flex flex-col items-end z-10 pr-16"
      >
        <motion.div variants={fadeUp} className="text-right mb-6">
          <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#111] dark:text-[#f5f5f5]">
            Tyrannosaurus Rex
          </h3>
          <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-[1.6] mt-1">
            Late Cretaceous period<br />
            68-66 million years ago
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="text-right mb-6 space-y-2">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400">Length</span>
            <p className="text-[13px] font-medium text-[#111] dark:text-[#f5f5f5]">12.3 m</p>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400">Height</span>
            <p className="text-[13px] font-medium text-[#111] dark:text-[#f5f5f5]">4.0 m</p>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#111] dark:text-[#f5f5f5]">
            View Details
          </span>
          <button
            onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center hover:border-black hover:bg-[#111] transition-colors duration-300 group cursor-pointer"
          >
            <Plus size={16} strokeWidth={1.5} className="text-[#111] group-hover:text-white transition-colors duration-300" />
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom left "Scroll to explore" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-[2.5rem] md:left-[4rem] hidden md:flex items-center gap-4 z-10"
      >
        <div className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-[4px]">
          <span className="w-[1px] h-[12px] bg-gray-600 dark:bg-gray-400" />
          <span className="w-[1px] h-[12px] bg-gray-600 dark:bg-gray-400" />
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-semibold">
          Scroll to explore
        </span>
      </motion.div>
    </section>
  )
}

/* ============================================================
   SECTION 2: EXPLORE OUR WORLD
   ============================================================ */

const actionPills = [
  { icon: Bone, label: 'Dinosaurs', target: 'safari', desc: 'Browse 50+ dinosaur species' },
  { icon: Dna, label: 'Ancient Life', target: 'collection', desc: 'Explore fossil chapters' },
  { icon: Gem, label: 'Minerals', target: 'collection', desc: 'View mineral & gem gallery' },
  { icon: Leaf, label: 'Fossils', target: 'collection', desc: 'Discover ancient fossils' },
  { icon: BookOpen, label: 'Learn More', target: 'about', desc: 'About Rachit\'s Museum' },
]

function ExploreSection() {
  return (
    <section id="explore" className="relative w-full min-h-[75vh] md:min-h-screen bg-white dark:bg-[#0a0a0a] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20 transition-colors duration-500">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12"
      >
        <span className="text-gray-500 dark:text-gray-400">[ 02 ]</span>{' '}
        <span className="text-gray-900 dark:text-gray-100 font-bold uppercase">Explore Our World</span>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] dark:text-[#f5f5f5] max-w-[1000px] text-center px-6"
      >
        Discover 50+ prehistoric species<br className="hidden md:block" /> from the Rachit's Historical Museum collection.
      </motion.h2>

      {/* Action pills */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={{
          animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
        }}
        className="flex flex-wrap justify-center gap-3 md:gap-4 mt-10 mb-10 md:mb-24 px-6"
      >
        {actionPills.map((pill) => {
          const Icon = pill.icon
          return (
            <motion.button
              key={pill.label}
              title={pill.desc}
              onClick={() => {
                const el = document.getElementById(pill.target)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              variants={{
                initial: { opacity: 0, y: 15 },
                animate: { opacity: 1, y: 0 },
              }}
              className="rounded-full border border-gray-300 dark:border-gray-600 text-[11px] font-medium uppercase tracking-wider bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-sm text-gray-800 dark:text-gray-200 px-5 py-2.5 flex items-center gap-2 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300 cursor-pointer"
            >
              <Icon size={14} strokeWidth={2} />
              {pill.label}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Spacer for overlapping pterodactyl */}
      <div className="min-h-[220px] md:min-h-[450px] w-full" />

      {/* Bottom text */}
      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none hidden md:flex justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
          RACHIT'S HISTORICAL MUSEUM — EXPLORE
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
          RACHIT'S HISTORICAL MUSEUM (C) 2026
        </span>
      </div>
    </section>
  )
}

/* ============================================================
   SECTION 3: ANCIENT COLLECTION
   ============================================================ */

function AncientCollectionSection({
  activeChapter,
  setActiveChapter,
}: {
  activeChapter: number
  setActiveChapter: (n: number) => void
}) {
  const chapter = chaptersData[activeChapter]
  const num = String(activeChapter + 1).padStart(2, '0')

  return (
    <section id="collection" className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30">
      {/* Pterodactyl image overlapping */}
      <motion.img
        initial={{ y: '-65%', opacity: 0 }}
        whileInView={{ y: '-78%', opacity: 1 }}
        viewport={{ once: true, margin: '100px' }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        src="https://cdn.pixabay.com/photo/2025/05/02/15/39/ai-generated-9574145_1280.jpg"
        alt="Pterodactyl"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] md:w-[1100px] pointer-events-none z-0"
      />

      {/* Heading area */}
      <div className="relative px-8 md:px-16 pt-32 md:pt-48 mb-16 z-10">
        <div className="flex flex-col xl:flex-row justify-between gap-8">
          {/* Left heading */}
          <h2 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white max-w-[900px]">
            Curated from millions of years of wonder{' '}
            <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 translate-y-[-4px]">
              {[Bone, Dna, Leaf].map((Icon, i) => (
                <span
                  key={i}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-colors duration-300 cursor-pointer"
                >
                  <Icon size={22} />
                </span>
              ))}
            </span>
            & discovery.
          </h2>

          {/* Right tagline + pills */}
          <div className="xl:text-right">
            <p className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed">
              WE DON'T JUST DISPLAY FOSSILS<br />
              WE SHARE EARTH'S STORY
            </p>
            <div className="flex flex-wrap gap-3 xl:justify-end">
              {[
                { label: 'Educational', target: 'explore' },
                { label: 'Authentic', target: 'collection' },
                { label: 'Inspiring', target: 'about' },
              ].map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => {
                    const el = document.getElementById(tag.target)
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 hover:bg-white hover:text-black hover:border-white transition-colors duration-300 cursor-pointer"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column panel */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="flex flex-col md:flex-row">
          {/* Left panel */}
          <div className="md:w-[35%] border-r-0 md:border-r border-gray-800 border-b md:border-b-0 min-h-[400px] md:min-h-[500px] relative flex flex-col">
            <div className="flex-1 flex flex-col">
              <div className="px-8 pt-8">
                <span className="text-gray-500 dark:text-gray-400 text-xl tracking-[0.3em] font-mono">***</span>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-[80%] h-[80%] m-auto"
                  >
                    <SandTransitionImage
                      src={chapter.image}
                      alt={chapter.name}
                      className="w-full h-full"
                    />
                    <img
                      src={chapter.image}
                      alt={chapter.name}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-contain mix-blend-lighten"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="px-8 pb-8">
              <span className="text-[10px] font-mono tracking-widest text-[#888] uppercase">
                <motion.span
                  key={num}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block"
                >
                  {num}
                </motion.span>
                <span className="text-[#333] mx-1">/</span>
                05
              </span>
            </div>
          </div>

          {/* Right panel */}
          <div className="md:w-[65%]">
            {/* Top bar */}
            <div className="border-b border-gray-800 p-8 flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 tracking-widest">
                Explore the past. Understand the present.
              </span>
              <span className="text-[10px] font-mono text-gray-400 tracking-widest">
                Chapter {num}
              </span>
            </div>

            {/* Chapter list */}
            {chaptersData.map((ch, i) => {
              const isActive = i === activeChapter
              return (
                <button
                  key={ch.name}
                  onClick={() => setActiveChapter(i)}
                  className="w-full flex items-center justify-between border-b border-gray-800/80 py-8 px-8 text-left group cursor-pointer"
                >
                  <span
                    className={`text-2xl md:text-[2rem] font-medium tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-[#444] hover:text-[#999]'
                    }`}
                  >
                    {ch.name}
                  </span>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowUpRight size={22} strokeWidth={1} className="text-gray-400" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom footer */}
      <div className="border-t border-gray-800">
        <div className="px-8 py-8 text-[10px] font-mono tracking-widest text-gray-400 uppercase bg-[#0a0a0a]">
          RACHIT'S HISTORICAL MUSEUM — DIGGING INTO OUR PLANET'S PAST
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   SECTION 4: DINOSAUR SAFARI (API-POWERED)
   ============================================================ */

function DinoSafariSection() {
  const [dinos, setDinos] = useState<DinoData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDino, setSelectedDino] = useState<DinoData | null>(null)
  const deferredSearch = useDeferredValue(searchTerm)
  const isStale = searchTerm !== deferredSearch

  useEffect(() => {
    const fetchDinos = async () => {
      const results: DinoData[] = []
      const batchSize = 8

      for (let i = 0; i < dinosaurList.length; i += batchSize) {
        const batch = dinosaurList.slice(i, i + batchSize)
        const fetched = await Promise.allSettled(
          batch.map(async (name) => {
            try {
              const res = await fetch(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
                { signal: AbortSignal.timeout(6000) }
              )
              if (!res.ok) throw new Error('Not found')
              const data = await res.json()
              const fallback = dinoFallback[name]
              return {
                name: data.title || name,
                image: data.thumbnail?.source || '',
                description: data.extract?.split('. ').slice(0, 3).join('. ') || fallback?.description || `${name} was a remarkable dinosaur from the Mesozoic Era.`,
                era: fallback?.era || 'Mesozoic Era',
                link: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
                diet: fallback?.diet,
                length: fallback?.length,
                weight: fallback?.weight,
              }
            } catch {
              const fallback = dinoFallback[name]
              return {
                name,
                image: '',
                description: fallback?.description || `${name} was a remarkable dinosaur from the Mesozoic Era.`,
                era: fallback?.era || 'Mesozoic Era',
                link: `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`,
                diet: fallback?.diet,
                length: fallback?.length,
                weight: fallback?.weight,
              } as DinoData
            }
          })
        )

        for (const result of fetched) {
          if (result.status === 'fulfilled') {
            results.push(result.value)
          }
        }

        setDinos([...results])
      }

      setLoading(false)
    }

    fetchDinos()
  }, [])

  const filtered = dinos.filter(
    (d) =>
      d.name.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      d.description.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      d.era.toLowerCase().includes(deferredSearch.toLowerCase())
  )

  return (
    <section id="safari" className="relative w-full bg-white dark:bg-[#111] text-[#111] dark:text-[#f5f5f5] z-20 py-24 md:py-32 transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-8"
        >
          <span className="text-gray-500 dark:text-gray-400">[ 03 ]</span>{' '}
          <span className="text-gray-900 dark:text-gray-100 font-bold uppercase">Dinosaur Safari</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">by Rachit Rahaman</span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] dark:text-[#f5f5f5] max-w-[900px] mb-6"
        >
          Explore the giants that ruled the Earth.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[13px] md:text-[14px] text-gray-700 dark:text-gray-300 max-w-[600px] mb-10 leading-relaxed"
        >
          Discover detailed profiles of 50+ dinosaurs, with information sourced from Wikipedia and the Rachit's Historical Museum archives.
        </motion.p>

        {/* Search + count */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, era, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-md text-sm font-mono text-[#111] dark:text-[#f5f5f5] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10 transition-colors duration-300"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-lg leading-none"
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </div>
          {!loading && (
            <span className="text-[10px] font-mono tracking-widest text-gray-400 dark:text-gray-500 uppercase">
              {filtered.length} species
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500 dark:text-gray-400 font-mono text-xs tracking-widest uppercase">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-black dark:border-t-white rounded-full block"
            />
            <span>Loading dinosaur database...</span>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">Fetching species data from Wikipedia</span>
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              animate: { transition: { staggerChildren: 0.03 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((dino) => (
              <motion.div
                key={dino.name}
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                layout
                onClick={() => setSelectedDino(selectedDino?.name === dino.name ? null : dino)}
                className="group bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden cursor-pointer hover:border-black dark:hover:border-white hover:shadow-[4px_4px_0px_#111] dark:hover:shadow-[4px_4px_0px_#f5f5f5] transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-[200px] bg-gray-100 dark:bg-[#161616] overflow-hidden">
                  {dino.image ? (
                    <img
                      src={dino.image}
                      alt={dino.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <span className="text-6xl font-bold text-white/20 font-mono">
                        {dino.name[0]}
                      </span>
                    </div>
                  )}
                  {/* Era badge */}
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[8px] font-mono tracking-widest uppercase rounded backdrop-blur-sm">
                    {dino.era}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-medium tracking-tight text-[#111] dark:text-[#f5f5f5] mb-2">
                    {dino.name}
                  </h3>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {dino.description}
                  </p>
                  {dino.diet && (
                    <div className="mt-3 flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase">
                      <span className="text-[#111] dark:text-[#f5f5f5] font-bold">{dino.diet}</span>
                      {dino.length && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <span className="text-gray-500 dark:text-gray-400">{dino.length}</span>
                        </>
                      )}
                      {dino.weight && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <span className="text-gray-500 dark:text-gray-400">{dino.weight}</span>
                        </>
                      )}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    <ArrowUpRight size={14} strokeWidth={1.5} />
                    {selectedDino?.name === dino.name ? 'Show less' : 'Read more'}
                  </div>
                </div>

                {/* Expanded info */}
                <AnimatePresence>
                  {selectedDino?.name === dino.name && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-5 bg-gray-50 dark:bg-[#161616]">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          {dino.diet && (
                            <div>
                              <span className="block text-[8px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Diet</span>
                              <span className="text-[11px] font-medium text-[#111] dark:text-[#f5f5f5]">{dino.diet}</span>
                            </div>
                          )}
                          {dino.length && (
                            <div>
                              <span className="block text-[8px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Length</span>
                              <span className="text-[11px] font-medium text-[#111] dark:text-[#f5f5f5]">{dino.length}</span>
                            </div>
                          )}
                          {dino.weight && (
                            <div>
                              <span className="block text-[8px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-1">Weight</span>
                              <span className="text-[11px] font-medium text-[#111] dark:text-[#f5f5f5]">{dino.weight}</span>
                            </div>
                          )}
                        </div>
                        <div className="mb-3 flex items-center gap-2 text-[9px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                          <span className="w-3 h-[1px] bg-gray-300 dark:bg-gray-600" />
                          Era: {dino.era}
                        </div>
                        <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                          {dino.description}
                        </p>
                        <a
                          href={dino.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-gray-900 dark:text-gray-100 font-bold hover:underline group/link"
                        >
                          <ExternalLink size={12} />
                          <span>View on Wikipedia</span>
                          <ArrowUpRight size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Bone size={48} strokeWidth={1} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
              No dinosaurs found for &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Bottom text */}
      <div className="mt-24 px-8 md:px-16 hidden md:flex justify-between">
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
          {filtered.length} SPECIES DOCUMENTED
        </span>
        <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
          RACHIT RAHAMAN (C) 2026
        </span>
      </div>
    </section>
  )
}

/* ============================================================
   SECTION 5: ABOUT RHM
   ============================================================ */

function AboutSection() {
  return (
    <section id="about" className="relative w-full bg-white dark:bg-[#0a0a0a] text-[#111] dark:text-[#f5f5f5] z-20 py-24 md:py-32 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12"
        >
          <span className="text-gray-500 dark:text-gray-400">[ 04 ]</span>{' '}
          <span className="text-gray-900 dark:text-gray-100 font-bold uppercase">About the Museum</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Left column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[2rem] md:text-[3rem] leading-[1.1] font-medium tracking-tight mb-6">
              Rachit's Historical Museum
            </h2>
            <p className="text-[13px] md:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Founded in 2026, the Rachit's Historical Museum is a digital archive dedicated to 
              preserving and showcasing Earth's prehistoric wonders. Our collection spans millions 
              of years of natural history, from the earliest fossils to the giant dinosaurs that 
              once ruled the planet.
            </p>
            <p className="text-[13px] md:text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              All specimens are sourced from verified paleontological archives and curated with 
              the goal of making natural history accessible to everyone, everywhere.
            </p>
            <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400">
              <div>
                <span className="block text-[24px] font-sans font-medium text-[#111] dark:text-[#f5f5f5]">50+</span>
                Species
              </div>
              <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />
              <div>
                <span className="block text-[24px] font-sans font-medium text-[#111] dark:text-[#f5f5f5]">5</span>
                Galleries
              </div>
              <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-700" />
              <div>
                <span className="block text-[24px] font-sans font-medium text-[#111] dark:text-[#f5f5f5]">2026</span>
                Founded
              </div>
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-8"
          >
            <div className="p-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-500">
              <h3 className="text-[10px] font-mono tracking-widest uppercase font-bold mb-2 text-[#111] dark:text-[#f5f5f5]">Our Mission</h3>
              <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                To document, preserve, and share the incredible diversity of prehistoric life 
                through high-quality digital exhibits and scientifically accurate information.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-500">
              <h3 className="text-[10px] font-mono tracking-widest uppercase font-bold mb-2 text-[#111] dark:text-[#f5f5f5]">Data Sources</h3>
              <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                Dinosaur profiles and images are sourced from the Wikipedia REST API and the 
                Natural History Museum data portal, ensuring accurate and up-to-date information.
              </p>
            </div>
            <div className="p-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 transition-colors duration-500">
              <h3 className="text-[10px] font-mono tracking-widest uppercase font-bold mb-2 text-[#111] dark:text-[#f5f5f5]">Contact</h3>
              <p className="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">
                Created by Rachit Rahaman. This project is open-source and built with 
                React, TypeScript, Tailwind CSS, and Motion.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-24 px-8 md:px-16">
        <div className="border-t border-gray-300 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
            &copy; 2026 Rachit's Historical Museum
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 font-medium">
            All Rights Reserved
          </span>
        </div>
      </div>
    </section>
  )
}

/* ============================================================
   MAIN APP
   ============================================================ */

export default function App() {
  const [showVideo, setShowVideo] = useState(false)
  const [activeChapter, setActiveChapter] = useState(2)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const timeout = setTimeout(() => setShowVideo(true), 2800)
    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % 5)
    }, 3500)
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] text-[#111] dark:text-[#f5f5f5] overflow-x-hidden font-sans relative transition-colors duration-500">
      {/* Header — shared across all sections */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-6 md:px-16 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <NHMLogo />
            <SubNav
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>
        <MobileMenu isOpen={isMobileMenuOpen} />
      </div>

      <HeroSection showVideo={showVideo} />
      <ExploreSection />
      <AncientCollectionSection
        activeChapter={activeChapter}
        setActiveChapter={setActiveChapter}
      />
      <DinoSafariSection />
      <AboutSection />
      <DarkModeToggle dark={dark} onToggle={() => setDark(!dark)} />
    </div>
  )
}
