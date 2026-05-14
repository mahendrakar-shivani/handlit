import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../utils/prisma';
import { sendEmail } from '../../utils/email';

const signToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = {
    expiresIn: '7d',
  };
  return jwt.sign({ id, role }, secret, options);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error('Email already registered');

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = signToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = signToken(user.id, user.role);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('No account found with that email');

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetExpiry: expiry },
  });

  await sendEmail(
    email,
    'Password Reset - Handlit',
    `<p>Hi ${user.name},</p>
     <p>Click the link below to reset your password. This link expires in 1 hour.</p>
     <a href="http://localhost:5173/reset-password/${token}">Reset Password</a>`
  );
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpiry: { gt: new Date() },
    },
  });
  if (!user) throw new Error('Invalid or expired reset token');

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, resetToken: null, resetExpiry: null },
  });
};

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) throw new Error('Old password is incorrect');

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};