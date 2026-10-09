import prisma from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ================= REGISTER =================

export const registerProvider = async (
  name: string,
  email: string,
  password: string,
  phone?: string
) => {

  const existingProvider =
    await prisma.provider.findUnique({
      where: { email }
    });

  if (existingProvider) {
    throw new Error("Provider already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const provider =
    await prisma.provider.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isVerified: true
      }
    });

  return provider;
};


// ================= LOGIN =================

export const loginProvider = async (
  email: string,
  password: string
) => {

  const provider =
    await prisma.provider.findUnique({
      where: { email }
    });

  if (!provider) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      provider.password
    );

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: provider.id,
      role: "PROVIDER"
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d"
    }
  );

  return {
    provider,
    token
  };
};


// ================= GET ALL =================

export const getAllProviders = async (
  query?: any
) => {

  const search =
    query?.search as string | undefined;

  const serviceId =
    query?.serviceId as string | undefined;

  const providers =
    await prisma.provider.findMany({
      where: {
        deletedAt: null,
        ...(search && {
          name: {
            contains: search,
            mode: "insensitive"
          }
        }),
        ...(serviceId && {
          services: {
            some: { serviceId }
          }
        })
      },
      orderBy: {
        name: "asc"
      }
    });

  return { providers };

};


// ================= GET ONE =================

export const getProviderById = async (
  id: string
) => {
  return await prisma.provider.findUnique({
    where: { id },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });
};


// ================= UPDATE =================

export const updateProvider = async (
  id: string,
  data: any
) => {

  return await prisma.provider.update({
    where: { id },
    data
  });

};


// ================= DELETE =================

export const softDeleteProvider = async (
  id: string
) => {

  return await prisma.provider.delete({
    where: { id }
  });

};


// ================= ADD SERVICE =================

export const addServiceToProvider = async (
  providerId: string,
  serviceId: string,
  price: number
) => {

  return await prisma.providerService.create({
    data: {
      providerId,
      serviceId,
      price
    }
  });

};


// ================= PROVIDER SERVICES =================

export const getProviderServices = async (
  providerId: string
) => {

  return await prisma.providerService.findMany({
    where: {
      providerId
    },
    include: {
      service: true
    }
  });

};