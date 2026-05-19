import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
dotenv.config();

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import providerRoutes from "./modules/providers/providers.routes";
import serviceRoutes from "./modules/services/services.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";
import reviewRoutes from "./modules/reviews/reviews.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check FIRST
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Option A path:
// Root Directory is blank → Railway clones full repo to /app
// __dirname = /app/backend/dist
// ../../frontend/dist = /app/frontend/dist ✅
const frontendPath = path.join(__dirname, "../../frontend/dist");

console.log(`Looking for frontend at: ${frontendPath}`);

if (fs.existsSync(frontendPath)) {
  console.log(`✅ Serving frontend from: ${frontendPath}`);
  app.use(express.static(frontendPath));
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  console.warn(`⚠️  Frontend dist not found at: ${frontendPath}`);
}

const PORT = Number(process.env.PORT) || 8080;

app.listen(PORT, "0.0.0.0", () => {
   console.log("Server started successfully");
   console.log(`Port: ${PORT}`);
});
