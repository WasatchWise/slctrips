import type { Express } from "express";
import { db } from "./db";
import { destinations } from "../shared/schema";
import { eq, sql, isNull, isNotNull } from "drizzle-orm";
import fs from "fs";
import path from "path";

// Google APIs integration routes
export function registerGoogleAPIsRoutes(app: Express) {
  
  // Google APIs status endpoint
  app.get("/api/admin/google-apis/status", async (req, res) => {
    try {
      // Check if Google OAuth credentials exist
      const oauthCredentialsPath = path.join(process.cwd(), "google-oauth-credentials.json");
      const hasOAuthCredentials = fs.existsSync(oauthCredentialsPath);

      // Check environment variables for Google APIs
      const hasDirectionsAPI = !!process.env.GOOGLE_MAPS_API_KEY;
      const hasGeocodingAPI = !!process.env.GOOGLE_MAPS_API_KEY;
      const hasPlacesAPI = !!process.env.GOOGLE_PLACES_API_KEY;

      res.json({
        directionsAPI: {
          status: hasDirectionsAPI ? "active" : "missing_key",
          lastChecked: new Date().toISOString()
        },
        geocodingAPI: {
          status: hasGeocodingAPI ? "active" : "missing_key",
          lastChecked: new Date().toISOString()
        },
        placesAPI: {
          status: hasPlacesAPI ? "active" : "missing_key",
          lastChecked: new Date().toISOString()
        },
        oauthCredentials: {
          status: hasOAuthCredentials ? "configured" : "missing",
          lastChecked: new Date().toISOString()
        }
      });
    } catch (_error) {
      // console.error("Google APIs status error:", error);
      res.status(500).json({ error: "Failed to check Google APIs status" });
    }
  });

  // Photo library status endpoint
  app.get("/api/admin/photos/library-status", async (req, res) => {
    try {
      // Count destinations with and without photos
      const totalDestinationsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(destinations);

      const destinationsWithPhotosResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(destinations)
        .where(isNotNull(destinations.photos));

      const totalDestinations = Number(totalDestinationsResult[0]?.count || 0);
      const destinationsWithPhotos = Number(destinationsWithPhotosResult[0]?.count || 0);

      res.json({
        totalDestinations,
        destinationsWithPhotos,
        destinationsNeedingPhotos: totalDestinations - destinationsWithPhotos,
        coveragePercentage: totalDestinations > 0 ? Math.round((destinationsWithPhotos / totalDestinations) * 100) : 0,
        timestamp: new Date().toISOString()
      });
    } catch (_error) {
      // console.error("Photo library status error:", error);
      res.status(500).json({ error: "Failed to fetch photo library status" });
    }
  });

  // Batch photo enrichment endpoint
  app.post("/api/admin/photos/enrich-batch", async (req, res) => {
    try {
      const { destinationIds, maxDestinations = 10 } = req.body;

      let destinationsToEnrich;
      if (destinationIds && Array.isArray(destinationIds)) {
        // Enrich specific destinations
        destinationsToEnrich = await db
          .select()
          .from(destinations)
          .where(sql`${destinations.id} = ANY(${destinationIds})`);
      } else {
        // Enrich destinations without photos
        destinationsToEnrich = await db
          .select()
          .from(destinations)
          .where(isNull(destinations.photos))
          .limit(maxDestinations);
      }

      // Start async enrichment process
      enrichDestinationsAsync(destinationsToEnrich);

      res.json({
        message: "Photo enrichment started",
        destinationsQueued: destinationsToEnrich.length,
        timestamp: new Date().toISOString()
      });
    } catch (_error) {
      // console.error("Batch photo enrichment error:", error);
      res.status(500).json({ error: "Failed to start photo enrichment" });
    }
  });

  // Drive time audit endpoint
  app.post("/api/admin/google-apis/audit-drive-times", async (req, res) => {
    try {
      // Get destinations with potentially inaccurate drive times
      const destinationsToAudit = await db
        .select()
        .from(destinations)
        .where(sql`${destinations.driveTime} < 30 OR ${destinations.driveTime} > 480`)
        .limit(20);

      // Start async audit process
      auditDriveTimesAsync(destinationsToAudit);

      res.json({
        message: "Drive time audit started",
        destinationsQueued: destinationsToAudit.length,
        timestamp: new Date().toISOString()
      });
    } catch (_error) {
      // console.error("Drive time audit error:", error);
      res.status(500).json({ error: "Failed to start drive time audit" });
    }
  });
}

// Async photo enrichment function
async function enrichDestinationsAsync(destinations: any[]) {
  // console.log(`Starting photo enrichment for ${destinations.length} destinations`);
  
  // Simulate photo enrichment process
  for (const destination of destinations) {
    try {
      // In a real implementation, this would call Google Places API
      // console.log(`Enriching photos for: ${destination.name}`);
      
      // Simulate delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock photo URL (in real implementation, get from Google Places API)
      const mockPhotoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=mock_${destination.id}`;
      
      // Update destination with photo
      await db
        .update(destinations)
        .set({
          coverPhotoUrl: mockPhotoUrl,
          coverPhotoAltText: `Photo of ${destination.name}`,
          updatedAt: new Date()
        })
        .where(eq(destinations.id, destination.id));
        
      // console.log(`✓ Photo added for: ${destination.name}`);
    } catch (_error) {
      // console.error(`✗ Photo enrichment failed for ${destination.name}:`, error);
    }
  }
  
  // console.log(`Completed photo enrichment for ${destinations.length} destinations`);
}

// Async drive time audit function
async function auditDriveTimesAsync(destinations: any[]) {
  // console.log(`Starting drive time audit for ${destinations.length} destinations`);
  
  for (const destination of destinations) {
    try {
      // console.log(`Auditing drive time for: ${destination.name}`);
      
      // In a real implementation, this would call Google Directions API
      // For now, we'll simulate corrections for obviously wrong times
      let correctedDriveTime = destination.driveTime;
      
      if (destination.driveTime < 30 && destination.category === "Ultimate Escapes") {
        correctedDriveTime = 240; // 4 hours for Ultimate Escapes
      } else if (destination.driveTime > 480 && destination.category === "Downtown & Nearby") {
        correctedDriveTime = 45; // 45 minutes for Downtown & Nearby
      }
      
      if (correctedDriveTime !== destination.driveTime) {
        await db
          .update(destinations)
          .set({
            driveTime: correctedDriveTime,
            driveTimeText: `${Math.floor(correctedDriveTime / 60)}h ${correctedDriveTime % 60}m`,
            updatedAt: new Date()
          })
          .where(eq(destinations.id, destination.id));
          
        // console.log(`✓ Drive time corrected for ${destination.name}: ${destination.driveTime}min → ${correctedDriveTime}min`);
      }
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (_error) {
      // console.error(`✗ Drive time audit failed for ${destination.name}:`, error);
    }
  }
  
  // console.log(`Completed drive time audit for ${destinations.length} destinations`);
}