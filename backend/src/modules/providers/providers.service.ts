import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../../utils/prisma';

const signToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign({ id, role }, secret, options);
};

export const registerProvider = async (
  name: string, email: string, password: string, phone?: string
) => {
  const exists = await prisma.provider.findUnique({ where: { email } });
  if (exists) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 12);
  const provider = await prisma.provider.create({
    data: { name, email, password: hashed, phone },
  });

  const token = signToken(provider.id, 'PROVIDER');
  return {
    provider: {
      id: provider.id, name: provider.name,
      email: provider.email, phone: provider.phone,
    },
    token,
  };
};

export const loginProvider = async (email: string, password: string) => {
  const provider = await prisma.provider.findUnique({ where: { email } });
  if (!provider) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, provider.password);
  if (!match) throw new Error('Invalid credentials');

  const token = signToken(provider.id, 'PROVIDER');
  return {
    provider: {
      id: provider.id, name: provider.name,
      email: provider.email, phone: provider.phone,
    },
    token,
  };
};

export const getAllProviders = async (filters: any) => {
  const { search, page = 1, limit = 10 } = filters;
  const where: any = { deletedAt: null };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  const providers = await prisma.provider.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    select: {
      id: true, name: true, email: true, phone: true,
      bio: true, rating: true, isVerified: true, createdAt: true,
    },
  });
  const total = await prisma.provider.count({ where });
  return { providers, total, page: Number(page), limit: Number(limit) };
};

export const getProviderById = async (id: string) => {
  const provider = await prisma.provider.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true, name: true, email: true, phone: true,
      bio: true, rating: true, isVerified: true, createdAt: true,
      services: { include: { service: true } },
    },
  });
  if (!provider) throw new Error('Provider not found');
  return provider;
};

export const updateProvider = async (id: string, data: any) => {
  const provider = await prisma.provider.findFirst({ where: { id, deletedAt: null } });
  if (!provider) throw new Error('Provider not found');
  return prisma.provider.update({
    where: { id },
    data,
    select: {
      id: true, name: true, email: true, phone: true,
      bio: true, rating: true, isVerified: true,
    },
  });
};

export const softDeleteProvider = async (id: string) => {
  const provider = await prisma.provider.findFirst({ where: { id, deletedAt: null } });
  if (!provider) throw new Error('Provider not found');
  return prisma.provider.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export const addServiceToProvider = async (
  providerId: string, serviceId: string, price: number
) => {
  const existing = await prisma.providerService.findUnique({
    where: { providerId_serviceId: { providerId, serviceId } },
  });
  if (existing) throw new Error('Service already added');
  return prisma.providerService.create({
    data: { providerId, serviceId, price },
    include: { service: true },
  });
};

export const getProviderServices = async (providerId: string) => {
  return prisma.providerService.findMany({
    where: { providerId },
    include: { service: { include: { category: true } } },
  });
};