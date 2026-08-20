import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  Lock, 
  WifiOff, 
  Users, 
  Download,
  CheckCircle2,
  AlertOctagon,
  Car,
  Hospital,
  Shield
} from 'lucide-react';

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  concept: string;
  keyPoints: string[];
  simpleExplanation: string;
  realWorldScenario: string;
  icon: React.ElementType;
  accentColor: string;
}

const PRESENTATION_SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'Executive Overview',
    title: 'Guardian AI: Intelligent Anti-Abduction & Kidnap Detection',
    subtitle: 'Next-Generation Personal Safety Powered by Artificial Intelligence & Emergency Dispatch',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'High-tech AI safety monitoring center',
    concept: 'An intelligent location safety platform that uses Generative AI and real-time motion sensors to detect if someone is in danger or being kidnapped, and immediately summons police help.',
    simpleExplanation: 'Guardian AI acts like a digital bodyguard on your phone. It monitors your travel route, detects abnormal stops or forced turns, and alerts police and loved ones before a dangerous situation escalates.',
    keyPoints: [
      'Real-time GPS tracking calibrated for India, Karnataka, and Bengaluru city.',
      'Generative AI threat assessment engine that analyzes abnormal movement patterns.',
      'One-tap Emergency SOS with automatic Police CAD dispatch (Namma 112).',
      'End-to-End Encryption ensuring strict privacy of all location and audio data.'
    ],
    realWorldScenario: 'A student or worker commuting home late at night is escorted digitally. If their vehicle is diverted into an unfamiliar route, the system spots the danger immediately.',
    icon: ShieldCheck,
    accentColor: 'from-emerald-500 to-teal-600'
  },
  {
    id: 2,
    badge: 'Core Feature #1',
    title: 'Tactical Location Tracking & Click-to-Locate',
    subtitle: 'Sub-Meter Precision Positioning with Instant Map Interaction',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Digital GPS navigation and location pins',
    concept: 'A real-time map interface showing your exact location with breadcrumb trails, speed indicators, and instant click-anywhere GPS locating.',
    simpleExplanation: 'You can see exactly where you are on an interactive map. Clicking the "Locate Me" button or tapping anywhere on the map immediately centers your beacon and calculates your live speed and heading.',
    keyPoints: [
      'Instant "Locate Me" button uses device hardware GPS for high accuracy.',
      'Interactive map click lets you center and test location coordinates instantly.',
      'Displays live velocity (km/h), cardinal heading (North/East/South/West), and route trails.',
      'Visual green and red route trails warn you if you move away from your planned path.'
    ],
    realWorldScenario: 'If you feel unsafe in an auto-rickshaw or taxi, tap "Locate Me" to immediately verify your exact coordinates and transmit your live beacon to safety teams.',
    icon: MapPin,
    accentColor: 'from-blue-500 to-cyan-600'
  },
  {
    id: 3,
    badge: 'Core Feature #2',
    title: 'Nearby Police Stations, Patrol Cars & Hospitals',
    subtitle: 'Live Emergency Safe Haven Network with Direct 1-Tap Calling',
    imageUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Police patrol car and emergency response',
    concept: 'Automatic proximity detection that ranks every police station, active Hoysala police car, and emergency hospital by straight-line distance to your current position.',
    simpleExplanation: 'Whenever you open the map, the app automatically finds the nearest police stations (112), moving patrol cars, and 24/7 hospitals, showing you how far they are and giving you one-touch buttons to call them.',
    keyPoints: [
      'Police Stations (Namma 112): Shows stations like Cubbon Park, Ashok Nagar, Koramangala with 1-tap dial.',
      'Active Hoysala Patrol Cars: Displays moving police vehicles, officer names, and estimated arrival times (ETA).',
      'Emergency Hospitals (108): Highlights 24/7 trauma hospitals (Victoria, Bowring, Manipal, NIMHANS).',
      'Dynamic guidance vectors draw blue, cyan, and green path lines directly to the closest safe haven.'
    ],
    realWorldScenario: 'If you are being followed, glance at your screen to see the closest police station just 480 meters away and run directly toward safety with live navigation guidance.',
    icon: Shield,
    accentColor: 'from-indigo-500 to-blue-600'
  },
  {
    id: 4,
    badge: 'Core Feature #3',
    title: 'Generative AI Threat & Abduction Prediction',
    subtitle: 'Gemini AI Telemetry Sensor Intelligence & Risk Scoring',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Artificial intelligence neural network visualization',
    concept: 'A cloud-based AI reasoning engine powered by Google Gemini that continuously analyzes sensor telemetry to detect potential kidnap and forced detour patterns.',
    simpleExplanation: 'Instead of waiting for an emergency button to be pressed, the smart AI watches for suspicious signs — like sudden sharp acceleration into a dark alley, high ambient noise screams, or device struggle sensors.',
    keyPoints: [
      'Calculates an Abduction Probability Score from 0% (Safe) to 99% (Critical Threat).',
      'Evaluates multi-sensor inputs: Phone shaking (struggle index), GPS speed spike, and acoustic decibels.',
      'Identifies likely escape and intercept choke points (e.g., Silk Board, Outer Ring Road expressway).',
      'Generates automated tactical directives for dispatchers and family members.'
    ],
    realWorldScenario: 'If a victim\'s phone is snatched or suddenly accelerated into a highway at 60 km/h with high noise levels, the AI raises a High-Threat Alert automatically.',
    icon: Sparkles,
    accentColor: 'from-purple-500 to-pink-600'
  },
  {
    id: 5,
    badge: 'Core Feature #4',
    title: 'Emergency SOS & Silent Duress Code',
    subtitle: 'Instant Police Alert with Anti-Coercion Protection',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Emergency SOS button and alarm signal',
    concept: 'A high-contrast emergency panic trigger that initiates instant police dispatch, live audio evidence recording, and covert duress unlock functionality.',
    simpleExplanation: 'Pressing the big red SOS button summons help instantly. If a criminal forces you to unlock your phone and cancel the alarm, typing your secret "Silent Duress PIN" appears to turn off the alarm while silently sending a covert distress signal to the police.',
    keyPoints: [
      'One-touch SOS button sends instant Computer Aided Dispatch (CAD) alert to Namma 112.',
      'Silent Duress PIN (e.g., 9999): Deceives attackers while secretly transmitting emergency coordinates.',
      'Captures live encrypted audio and location snapshots for immediate emergency transmission.',
      'Produces distinct sensory haptic vibration and audio feedback during distress triggers.'
    ],
    realWorldScenario: 'If an attacker demands that you "cancel that alarm now," entering your silent duress code shows a normal screen to the attacker while silently routing police to your exact GPS coordinates.',
    icon: PhoneCall,
    accentColor: 'from-red-500 to-rose-600'
  },
  {
    id: 6,
    badge: 'Core Feature #5',
    title: 'End-to-End Encryption & Privacy Protection',
    subtitle: 'Zero-Knowledge Security & Tamper-Proof Chain of Custody',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Encrypted cyber security lock and shield',
    concept: 'Military-grade cryptographic protocols ensuring that personal location, voice, and contact records are only accessible to authorized emergency responders.',
    simpleExplanation: 'Your sensitive personal data is converted into secret encrypted code on your phone before it is sent anywhere. No unauthorized third party or hacker can peek at where you travel.',
    keyPoints: [
      'AES-GCM 256-bit encryption protects all live GPS coordinates and audio recordings.',
      'SHA-256 cryptographic hashing creates tamper-proof evidence logs admissible in legal investigations.',
      'Local-first privacy architecture stores your safe routes and personal contacts securely on your device.',
      'Zero unauthorized tracking when the app is in normal standby mode.'
    ],
    realWorldScenario: 'All recorded evidence from an incident is locked with a unique digital seal so it can be presented to law enforcement as authentic, un-tampered proof.',
    icon: Lock,
    accentColor: 'from-amber-500 to-orange-600'
  },
  {
    id: 7,
    badge: 'Core Feature #6',
    title: 'Offline Maps & Emergency Mesh Connectivity',
    subtitle: 'Guaranteed Protection in Cellular Dead Zones & Low-Signal Areas',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Satellite mesh connectivity and offline terrain',
    concept: 'Pre-cached offline vector maps and ultra-compressed emergency data packets that transmit even when mobile internet and 4G/5G connections are lost.',
    simpleExplanation: 'If you travel into a basement, tunnel, or remote highway with zero cellular data, the app keeps working using stored offline maps and can send tiny 140-character emergency signals over basic SMS or satellite mesh.',
    keyPoints: [
      'Offline Map Packs for Bengaluru Central, Outer Ring Road, and Highway Corridors.',
      '140-Character Compressed SOS Packets transmit location via emergency SMS or satellite fallback.',
      'Detects "Dead Zone" entries and warns the user in advance of connectivity drops.',
      'Zero dependency on continuous internet for local emergency calculations and safe haven lookups.'
    ],
    realWorldScenario: 'If you are taken into an underground parking lot or rural highway with no internet, the app continues tracking and broadcasts low-frequency distress beacons.',
    icon: WifiOff,
    accentColor: 'from-teal-500 to-emerald-600'
  },
  {
    id: 8,
    badge: 'Core Feature #7',
    title: 'Multi-Role Dashboard: Family & Police Dispatcher',
    subtitle: 'Unified Real-Time Collaboration Across Devices and Emergency Teams',
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Emergency dispatchers collaborating on monitors',
    concept: 'Dedicated specialized interfaces for different stakeholders: Victims (simple controls), Family Guardians (remote live view), and Police Dispatchers (full CAD command).',
    simpleExplanation: 'Guardian AI adapts to who is using it. Family members get a comforting screen showing live location and battery status, while police officers get a tactical command dashboard with unit dispatch controls.',
    keyPoints: [
      'Victim View: Simple high-contrast buttons optimized for high-stress panic moments.',
      'Family Guardian View: Live tracking, emergency contact broadcast, and one-tap police escalation.',
      'Police Dispatcher View: Formal Computer Aided Dispatch (CAD) incident logs, Hoysala unit assignments.',
      'Cross-platform layout optimized for mobile smartphones, tablets, and desktop command centers.'
    ],
    realWorldScenario: 'A parent receives a push notification on their phone the second their child diverges from their customary route, with a direct button to connect with the local police precinct.',
    icon: Users,
    accentColor: 'from-sky-500 to-indigo-600'
  }
];

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];
  const IconComponent = currentSlide.icon;

  const nextSlide = () => {
    if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in overflow-y-auto">
      <div className={`w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'h-full max-h-none rounded-none' : 'max-h-[92vh]'
      }`}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Formal Product Deck
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Guardian AI System Architecture & Feature Presentation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              title="Close Presentation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 md:p-8 space-y-6">
          {/* Slide Title & Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${currentSlide.accentColor} shadow-md`}>
                {currentSlide.badge}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <IconComponent className="w-7 h-7 text-emerald-400 flex-shrink-0" />
              <span>{currentSlide.title}</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Main 2-Column Presentation Layout: Feature Picture & Visual Explanations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: High Quality Visual Feature Image & Scenario (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Feature Picture Frame */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 aspect-video lg:aspect-[4/3] group">
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.imageAlt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-xs text-zinc-300 bg-zinc-950/80 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800/80 shadow-lg">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Feature Visual Representation
                  </div>
                  <div className="font-semibold text-white mt-0.5 truncate">{currentSlide.imageAlt}</div>
                </div>
              </div>

              {/* Real World Scenario Box */}
              <div className="bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl">
                <div className="text-xs uppercase font-mono font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                  Real-World Application Scenario
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{currentSlide.realWorldScenario}"
                </p>
              </div>
            </div>

            {/* Right Column: Formal Explanations in Simple Words (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. What is it in Simple Words */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-lg space-y-2">
                <div className="text-xs uppercase font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  In Simple Words (Plain English Summary)
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                  {currentSlide.simpleExplanation}
                </p>
              </div>

              {/* 2. Key Functional Highlights */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 sm:p-5 rounded-2xl shadow-lg space-y-3">
                <div className="text-xs uppercase font-mono font-bold text-zinc-400">
                  Key Functional Capabilities:
                </div>
                <ul className="space-y-2.5">
                  {currentSlide.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Technical & Architectural Grounding */}
              <div className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-xl text-xs text-zinc-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200">System Technical Core: </span>
                  {currentSlide.concept}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Navigation Bar & Thumbnails */}
        <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-900/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Thumbnails Navigation Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                  currentSlideIndex === idx
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-950'
                    : 'bg-zinc-800/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                0{slide.id}
              </button>
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-bold shadow-lg shadow-emerald-950 transition-all"
            >
              <span>Next Feature</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
