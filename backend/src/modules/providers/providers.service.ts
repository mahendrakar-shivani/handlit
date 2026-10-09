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
        isVerified: false
      }
    });

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

  const { password: _password, ...safeProvider } = provider;

  return {
    provider: safeProvider,
    token
  };
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

  if (!provider || provider.deletedAt) {
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

  const { password: _password, ...safeProvider } = provider;

  return {
    provider: safeProvider,
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
      omit: { password: true },
      where: {
        deletedAt: null,
        isVerified: true,
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
    omit: { password: true },
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

  const allowed: Record<string, unknown> = {};

  for (const key of ["name", "phone", "bio"]) {
    if (data && data[key] !== undefined) {
      allowed[key] = data[key];
    }
  }

  return await prisma.provider.update({
    where: { id },
    data: allowed,
    omit: { password: true }
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

  const service = await prisma.service.findFirst({
    where: { id: serviceId, deletedAt: null }
  });

  if (!service) {
    throw new Error("Service not found");
  }

  return await prisma.providerService.upsert({
    where: {
      providerId_serviceId: { providerId, serviceId }
    },
    update: { price },
    create: { providerId, serviceId, price }
  });

};


// ================= REMOVE SERVICE =================

export const removeServiceFromProvider = async (
  providerId: string,
  serviceId: string
) => {

  return await prisma.providerService.delete({
    where: {
      providerId_serviceId: { providerId, serviceId }
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