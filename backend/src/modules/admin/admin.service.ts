import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const loginAdmin = async (
  email: string,
  password: string
) => {

  // temporary hardcoded admin login
  if (
    email === "admin@handlit.com" &&
    password === "Admin@123"
  ) {

    const token = jwt.sign(
      {
        email,
        role: "ADMIN"
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    );

    return {
      admin: {
        email,
        role: "ADMIN"
      },
      token
    };
  }

  throw new Error("Invalid credentials");
};



export const getDashboardStats = async () => {

  const totalUsers =
    await prisma.user.count();

  const totalProviders =
    await prisma.provider.count();

  const totalBookings =
    await prisma.booking.count();

  return {
    totalUsers,
    totalProviders,
    totalBookings
  };
};



export const getAllUsers = async () => {

  return prisma.user.findMany({
    where: {
      deletedAt: null
    }
  });

};



export const getAllProviders = async () => {

  return prisma.provider.findMany({
    where: {
      deletedAt: null
    }
  });

};



export const verifyProvider = async (
  id: string
) => {

  return prisma.provider.update({
    where: {
      id
    },
    data: {
      isVerified: true
    }
  });

};



export const banUser = async (
  id: string
) => {

  return prisma.user.update({
    where: {
      id
    },
    data: {
      deletedAt: new Date()
    }
  });

};



export const getAllBookingsAdmin =
async () => {

  return prisma.booking.findMany({
    include: {
      user: true,
      provider: true,
      service: true
    }
  });

};