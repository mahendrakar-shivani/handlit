import { Router } from "express";
import * as adminController from "./admin.controller";
import { protect, adminOnly } from "../../middlewares/auth.middleware";

const router = Router();

// Public route (must be before protect)
router.post("/login", adminController.loginAdmin);

// Protected routes
router.use(protect, adminOnly);

router.get("/stats", adminController.getDashboardStats);

router.get("/users", adminController.getUsers);

router.get("/providers", adminController.getProviders);

router.patch("/providers/:id/verify", adminController.verifyProvider);

router.patch("/users/:id/ban", adminController.banUser);

router.get("/bookings", adminController.getBookings);

export default router;
