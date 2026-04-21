import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("satelles.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    severity TEXT,
    location TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS zones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    lat REAL,
    lng REAL,
    risk_level TEXT,
    last_scan DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed data if empty
const alertCount = db.prepare("SELECT count(*) as count FROM alerts").get() as { count: number };
if (alertCount.count === 0) {
  db.prepare("INSERT INTO alerts (type, severity, location, message) VALUES (?, ?, ?, ?)").run(
    "Flood", "High", "Rhine River Basin", "Water levels exceeding safety threshold by 1.2m"
  );
  db.prepare("INSERT INTO alerts (type, severity, location, message) VALUES (?, ?, ?, ?)").run(
    "Drought", "Medium", "Southern Spain", "Soil moisture levels at 15% - critical for agriculture"
  );
  db.prepare("INSERT INTO alerts (type, severity, location, message) VALUES (?, ?, ?, ?)").run(
    "Pollution", "Low", "Danube Delta", "Minor chemical anomaly detected via Sentinel-2 spectral analysis"
  );
}

const zoneCount = db.prepare("SELECT count(*) as count FROM zones").get() as { count: number };
if (zoneCount.count === 0) {
  db.prepare("INSERT INTO zones (name, lat, lng, risk_level) VALUES (?, ?, ?, ?)").run("Amsterdam", 52.3676, 4.9041, "Medium");
  db.prepare("INSERT INTO zones (name, lat, lng, risk_level) VALUES (?, ?, ?, ?)").run("Venice", 45.4408, 12.3155, "High");
  db.prepare("INSERT INTO zones (name, lat, lng, risk_level) VALUES (?, ?, ?, ?)").run("Madrid", 40.4168, -3.7038, "Low");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/alerts", (req, res) => {
    const alerts = db.prepare("SELECT * FROM alerts ORDER BY timestamp DESC").all();
    res.json(alerts);
  });

  app.get("/api/zones", (req, res) => {
    const zones = db.prepare("SELECT * FROM zones").all();
    res.json(zones);
  });

  app.post("/api/analyze", (req, res) => {
    const { lat, lng } = req.body;
    
    // Static Mock Data for Seeded Locations
    const mockLocations: Record<string, any> = {
      "52.3676,4.9041": { // Amsterdam
        floodRisk: 65,
        droughtRisk: 12,
        pollutionRisk: 28,
        soilMoisture: "78.2",
        waterLevel: "0.45",
        tempAnomaly: "+0.8",
        recommendation: "Moderate flood risk detected in polder areas. Monitor secondary pumping stations."
      },
      "45.4408,12.3155": { // Venice
        floodRisk: 92,
        droughtRisk: 5,
        pollutionRisk: 45,
        soilMoisture: "89.5",
        waterLevel: "1.12",
        tempAnomaly: "+1.2",
        recommendation: "CRITICAL: High tide surge predicted. Activate MOSE barriers immediately and issue city-wide alerts."
      },
      "40.4168,-3.7038": { // Madrid
        floodRisk: 8,
        droughtRisk: 74,
        pollutionRisk: 52,
        soilMoisture: "12.4",
        waterLevel: "0.12",
        tempAnomaly: "+3.4",
        recommendation: "Severe drought conditions. Soil moisture at critical levels. Recommend water conservation protocols for public parks."
      }
    };

    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    const staticData = mockLocations[key];

    if (staticData) {
      return res.json({
        coords: { lat, lng },
        metrics: {
          floodRisk: staticData.floodRisk,
          droughtRisk: staticData.droughtRisk,
          pollutionRisk: staticData.pollutionRisk,
          soilMoisture: staticData.soilMoisture,
          waterLevel: staticData.waterLevel,
          tempAnomaly: staticData.tempAnomaly
        },
        recommendation: staticData.recommendation,
        timestamp: new Date().toISOString(),
        satellite: "Global Satellite Network (MOCK DATA)"
      });
    }

    // Fallback pseudo-random logic for other points
    const seed = (lat + lng) * 1000;
    const pseudoRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const floodRisk = Math.floor(pseudoRandom(seed) * 100);
    const droughtRisk = Math.floor(pseudoRandom(seed + 1) * 100);
    
    res.json({
      coords: { lat, lng },
      metrics: {
        floodRisk,
        droughtRisk,
        pollutionRisk: Math.floor(pseudoRandom(seed + 2) * 100),
        soilMoisture: (20 + pseudoRandom(seed + 3) * 60).toFixed(1),
        waterLevel: (1.5 + pseudoRandom(seed + 4) * 4).toFixed(2),
        tempAnomaly: (pseudoRandom(seed + 5) * 5 - 2).toFixed(1)
      },
      recommendation: floodRisk > 70 ? "High flood risk. Check local drainage." : droughtRisk > 70 ? "Drought warning. Monitor agriculture." : "Normal conditions detected.",
      timestamp: new Date().toISOString(),
      satellite: "Global Satellite Network (MOCK DATA)"
    });
  });

  app.post("/api/simulate", (req, res) => {
    const { rainfall, tempIncrease, consumption } = req.body;
    
    // Simple simulation logic
    const baseFlood = rainfall * 0.8;
    const baseDrought = (tempIncrease * 10) + (consumption * 0.5);
    
    res.json({
      prediction: {
        floodRisk: Math.min(100, Math.max(0, baseFlood)),
        droughtRisk: Math.min(100, Math.max(0, baseDrought)),
        waterStress: Math.min(100, Math.max(0, (baseDrought + baseFlood) / 2))
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
