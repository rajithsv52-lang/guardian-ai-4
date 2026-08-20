import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client Server-Side with User-Agent
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      timestamp: Date.now(),
      geminiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // Rate limiting cooldown and response cache for Gemini AI
  let geminiCooldownUntil = 0;
  const assessmentCache = new Map<string, { timestamp: number; assessment: any }>();

  // Intelligent Threat Assessment & Abduction Predictive Analytics using Gemini AI
  app.post('/api/threat-assessment', async (req, res) => {
    try {
      const {
        telemetry,
        safeRouteCoords,
        recentTrajectory,
        victimProfile,
        activeSosTriggered,
        silentDuressCode
      } = req.body;

      // Deterministic fallback generator for fast local response or when rate-limited
      const generateFallbackAssessment = () => {
        let threatLevel = 'LOW';
        let abductionProb = 8;
        const vectors: any[] = [];
        const isDeviated = telemetry?.isDeviatedFromSafeRoute;
        const speed = telemetry?.speed || 0;
        const struggle = telemetry?.deviceStruggleIndex || 0;
        const noise = telemetry?.ambientNoiseDb || 45;
        const isDeadZone = telemetry?.isInDeadZone;

        if (activeSosTriggered || silentDuressCode) {
          threatLevel = 'CRITICAL';
          abductionProb = 98;
          vectors.push({
            id: 'vec_sos',
            category: 'AUDIO_DISTRESS',
            severity: 'CRITICAL',
            description: silentDuressCode
              ? 'SILENT DURESS PIN ENTERED: Victim under immediate physical coercion.'
              : 'DIRECT SOS TRIGGER ACTIVATED: Immediate high-priority tactical emergency response required.',
            detectedAt: Date.now()
          });
        }

        if (isDeviated) {
          abductionProb += 35;
          vectors.push({
            id: 'vec_dev',
            category: 'ROUTE_DEVIATION',
            severity: 'HIGH',
            description: 'Abrupt 850m route divergence from customary safe transit corridor into low-visibility alley/highway.',
            detectedAt: Date.now() - 45000
          });
        }

        if (speed > 45 && struggle > 50) {
          abductionProb += 40;
          vectors.push({
            id: 'vec_spd_struggle',
            category: 'SPEED_ANOMALY',
            severity: 'CRITICAL',
            description: `High-velocity vehicular acceleration (${speed} km/h) coupled with extreme device struggle sensor spike (${struggle}/100). Forced vehicular abduction pattern.`,
            detectedAt: Date.now() - 20000
          });
        } else if (speed > 55) {
          abductionProb += 25;
          vectors.push({
            id: 'vec_spd',
            category: 'SPEED_ANOMALY',
            severity: 'HIGH',
            description: `Abnormal rapid transit speed (${speed} km/h) inconsistent with pedestrian transit pattern.`,
            detectedAt: Date.now() - 15000
          });
        }

        if (noise > 82) {
          abductionProb += 20;
          vectors.push({
            id: 'vec_audio',
            category: 'AUDIO_DISTRESS',
            severity: 'HIGH',
            description: `High decibel distress spike (${noise} dB) matching acoustic signature of scream / physical scuffle.`,
            detectedAt: Date.now() - 10000
          });
        }

        if (isDeadZone) {
          abductionProb += 15;
          vectors.push({
            id: 'vec_jam',
            category: 'SIGNAL_JAMMING',
            severity: 'MEDIUM',
            description: 'Rapid transition into low-signal blind-spot / cellular deadzone corridor.',
            detectedAt: Date.now() - 30000
          });
        }

        abductionProb = Math.min(Math.max(abductionProb, 4), 99);

        if (abductionProb >= 80) threatLevel = 'CRITICAL';
        else if (abductionProb >= 50) threatLevel = 'HIGH';
        else if (abductionProb >= 25) threatLevel = 'ELEVATED';
        else threatLevel = 'LOW';

        return {
          threatLevel,
          abductionProbability: abductionProb,
          headline: threatLevel === 'CRITICAL'
            ? 'CRITICAL ALERT: High-Confidence Forced Abduction Pattern Detected'
            : threatLevel === 'HIGH'
            ? 'HIGH THREAT: Severe Trajectory Deviation & Distress Indicators'
            : threatLevel === 'ELEVATED'
            ? 'ELEVATED CAUTION: Anomalous Motion & Route Inconsistency'
            : 'NORMAL: Safe Route Telemetry Consistent',
          analysisSummary: `Predictive AI model evaluated multi-sensor telemetry (GPS Velocity: ${speed} km/h, Struggle Index: ${struggle}/100, Ambient Acoustic: ${noise} dB). ${
            threatLevel === 'CRITICAL'
              ? 'Immediate trajectory intercept and Computer Aided Dispatch (CAD) police alert triggered.'
              : threatLevel === 'HIGH'
              ? 'Automated monitoring enabled with proactive emergency contact telemetry sync.'
              : 'All vital telemetry remains within expected safety tolerances.'
          }`,
          threatVectors: vectors,
          predictedIntercepts: [
            {
              corridorName: 'Outer Ring Road - Koramangala / Silk Board Intercept Alpha',
              lat: (telemetry?.lat || 12.9716) + 0.008,
              lng: (telemetry?.lng || 77.5946) - 0.006,
              etaMinutes: 3.2,
              riskScore: 92
            },
            {
              corridorName: 'Hosur Road Expressway / Electronic City Toll Choke Point',
              lat: (telemetry?.lat || 12.9716) + 0.015,
              lng: (telemetry?.lng || 77.5946) + 0.012,
              etaMinutes: 6.5,
              riskScore: 78
            }
          ],
          tacticalDirectives: [
            'Maintain continuous encrypted GPS telemetry beacon broadcast.',
            'Deploy Bengaluru City Police Namma 112 Hoysala units to nearest choke-points.',
            'Transcode emergency packet into 140-char satellite mesh fallback format.',
            'Preserve tamper-proof encrypted sensor chain-of-custody hash.'
          ],
          lawEnforcementCadSummary: `[NAMMA 112 - PRIORITY 1 CAD] VICTIM: ${victimProfile?.name || 'Jane Doe'} | LOC: ${telemetry?.lat?.toFixed(5) || '12.97160'}, ${telemetry?.lng?.toFixed(5) || '77.59460'} (Bengaluru, KA) | HEADING: ${telemetry?.heading || 315}° @ ${telemetry?.speed || 0} km/h | THREAT: ${threatLevel} (${abductionProb}% Abduction Prob) | ANOMALY: ${vectors.map(v => v.category).join(', ') || 'NONE'} | ASSIGNED PRECINCT: BENGALURU CITY POLICE CENTRAL #1`,
          recommendedAction: threatLevel === 'CRITICAL' ? 'FULL_POLICE_INTERCEPT' : threatLevel === 'HIGH' ? 'TRIGGER_SILENT_DISPATCH' : threatLevel === 'ELEVATED' ? 'NOTIFY_GUARDIANS' : 'MONITOR'
        };
      };

      // Check request cache (15-second TTL)
      const cacheKey = `${telemetry?.lat?.toFixed(4)}_${telemetry?.lng?.toFixed(4)}_${telemetry?.speed}_${telemetry?.isDeviatedFromSafeRoute}_${activeSosTriggered}_${silentDuressCode}`;
      const cached = assessmentCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 15000) {
        return res.json({ success: true, source: 'cache', assessment: cached.assessment });
      }

      // Check if Gemini is in cooldown due to rate limit (429)
      const now = Date.now();
      if (ai && now > geminiCooldownUntil) {
        try {
          const prompt = `You are the core intelligence engine of Guardian AI, an anti-abduction and kidnapping detection system operating for Bengaluru, Karnataka, India (Namma 112 Emergency Command Center).
Analyze the following victim telemetry and situational parameters:
- Telemetry: ${JSON.stringify(telemetry)}
- Safe Route Coords: ${JSON.stringify(safeRouteCoords || [])}
- Recent Trajectory Breadcrumbs: ${JSON.stringify(recentTrajectory || [])}
- Victim Profile: ${JSON.stringify(victimProfile || { name: 'Jane Doe', age: 24 })}
- Direct SOS Trigger: ${activeSosTriggered ? 'YES' : 'NO'}
- Silent Duress Code: ${silentDuressCode ? 'TRIGGERED' : 'NONE'}

Evaluate for abduction indicators: sudden route departure, rapid vehicle speed pickup while pedestrian, acoustic distress spikes, accelerometer agitation (device being ripped away / struggle), deadzone heading, and silent duress.

Generate a comprehensive tactical assessment adhering strictly to the JSON schema. Use Bengaluru landmarks (e.g., MG Road, Koramangala, Silk Board, Outer Ring Road, Indiranagar, Namma 112).`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  threatLevel: {
                    type: Type.STRING,
                    description: 'Threat severity: LOW, ELEVATED, HIGH, or CRITICAL'
                  },
                  abductionProbability: {
                    type: Type.NUMBER,
                    description: 'Probability of abduction between 0 and 100'
                  },
                  headline: {
                    type: Type.STRING,
                    description: 'Short high-impact tactical alert headline'
                  },
                  analysisSummary: {
                    type: Type.STRING,
                    description: 'Concise, rigorous intelligence summary of the physical and trajectory situation'
                  },
                  threatVectors: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        category: { type: Type.STRING },
                        severity: { type: Type.STRING },
                        description: { type: Type.STRING },
                        detectedAt: { type: Type.NUMBER }
                      },
                      required: ['id', 'category', 'severity', 'description', 'detectedAt']
                    }
                  },
                  predictedIntercepts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        corridorName: { type: Type.STRING },
                        lat: { type: Type.NUMBER },
                        lng: { type: Type.NUMBER },
                        etaMinutes: { type: Type.NUMBER },
                        riskScore: { type: Type.NUMBER }
                      },
                      required: ['corridorName', 'lat', 'lng', 'etaMinutes', 'riskScore']
                    }
                  },
                  tacticalDirectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  lawEnforcementCadSummary: {
                    type: Type.STRING,
                    description: 'Standard 911 / Police CAD dispatch string with victim name, exact GPS, speed, bearing, and priority code'
                  },
                  recommendedAction: {
                    type: Type.STRING,
                    description: 'MONITOR, NOTIFY_GUARDIANS, TRIGGER_SILENT_DISPATCH, or FULL_POLICE_INTERCEPT'
                  }
                },
                required: [
                  'threatLevel',
                  'abductionProbability',
                  'headline',
                  'analysisSummary',
                  'threatVectors',
                  'predictedIntercepts',
                  'tacticalDirectives',
                  'lawEnforcementCadSummary',
                  'recommendedAction'
                ]
              }
            }
          });

          if (response.text) {
            const parsed = JSON.parse(response.text.trim());
            assessmentCache.set(cacheKey, { timestamp: Date.now(), assessment: parsed });
            return res.json({ success: true, source: 'gemini-2.5-flash', assessment: parsed });
          }
        } catch (geminiError: any) {
          // If rate limited (429), activate a 60-second cooldown to avoid hammering the API
          if (geminiError?.status === 429 || geminiError?.message?.includes('429') || geminiError?.message?.includes('quota')) {
            geminiCooldownUntil = Date.now() + 60000;
          }
        }
      }

      // Fallback to deterministic real-time engine
      const fallback = generateFallbackAssessment();
      assessmentCache.set(cacheKey, { timestamp: Date.now(), assessment: fallback });
      return res.json({ success: true, source: 'guardian-tactical-engine', assessment: fallback });
    } catch (err: any) {
      console.error('Threat assessment error:', err);
      res.status(500).json({ error: 'Failed to process threat assessment', details: err.message });
    }
  });

  // Emergency Police CAD Dispatch Trigger
  app.post('/api/emergency-dispatch', (req, res) => {
    try {
      const { victimProfile, telemetry, threatLevel, audioEvidenceIncluded } = req.body;
      const cadEventNumber = `CAD-911-${Math.floor(100000 + Math.random() * 900000)}`;

      const assignedUnits = [
        {
          unitId: 'HOYSALA-402',
          callSign: 'Namma 112 Hoysala Patrol #4',
          officerName: 'ASI Manjunath & PC Suresh',
          status: 'DISPATCHED',
          distanceKm: 0.6,
          etaMinutes: 1.8,
          currentLat: (telemetry?.lat || 12.9716) + 0.003,
          currentLng: (telemetry?.lng || 77.5946) - 0.002,
          vehicleType: 'Cruiser'
        },
        {
          unitId: 'INTERCEPT-109',
          callSign: 'Traffic Rapid Interceptor #9',
          officerName: 'Inspector Raghavendra',
          status: 'EN_ROUTE',
          distanceKm: 1.4,
          etaMinutes: 3.2,
          currentLat: (telemetry?.lat || 12.9716) + 0.008,
          currentLng: (telemetry?.lng || 77.5946) + 0.004,
          vehicleType: 'Interceptor'
        },
        {
          unitId: 'AIR-WING-2',
          callSign: 'Bengaluru Police Drone Recon Wing',
          officerName: 'Drone Operator Karthik',
          status: 'STANDBY',
          distanceKm: 3.5,
          etaMinutes: 4.5,
          currentLat: (telemetry?.lat || 12.9716) - 0.015,
          currentLng: (telemetry?.lng || 77.5946) + 0.01,
          vehicleType: 'Air Support'
        }
      ];

      res.json({
        success: true,
        cadEventNumber,
        dispatchStatus: 'PRIORITY_1_IN_PROGRESS',
        timestamp: Date.now(),
        assignedUnits,
        radioBroadcastChannel: 'NAMMA-112-TAC-SECURE',
        broadcastMessage: `ALL UNITS: 10-99 POSSIBLE ABDUCTION IN PROGRESS. VICTIM: ${victimProfile?.name || 'Jane Doe'}, LAST PING: ${telemetry?.lat?.toFixed(5)}°N, ${telemetry?.lng?.toFixed(5)}°E (Bengaluru). HOYSALA-402 & INTERCEPT-109 RESPOND CODE 3.`
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to initiate police dispatch', details: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Guardian AI Emergency Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
