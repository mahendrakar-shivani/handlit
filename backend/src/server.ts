import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// Serve React frontend in production
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// All non-API routes serve React app
// All non-API routes serve React app
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
