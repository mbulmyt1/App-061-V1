"use server"

import { auth } from '@/lib/auth'; // Assuming auth is here
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { addressSchema, updateAddressSchema } from '@/lib/validators/address';

// Helper function for Admin Check
export async function ensureUser() {
const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) throw new Error("Unauthorized");

  // if (session.user.role !== "ADMIN") {
  //   throw new Error("Forbidden");
  // }
  return session;
}

export async function ensureAdmin() {
  const headersList = await headers();
  
    const session = await auth.api.getSession({
      headers: headersList,
    });
  
    if (!session) throw new Error("Unauthorized");
  
    if (session.user.role !== "ADMIN") {
      throw new Error("Forbidden");
    }
    return session;
  }
  
  // Server Action: getAddresses
export async function getAddresses({
  searchQuery = '',
  page = 1,
  pageSize = 6,
}: {
  searchQuery?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  try {
    await ensureUser();

    const whereClause = searchQuery
      ? {
          OR: [
            { firstName: { contains: searchQuery, mode: 'insensitive' } },
            { lastName: { contains: searchQuery, mode: 'insensitive' } },
            { company: { contains: searchQuery, mode: 'insensitive' } },
            { street: { contains: searchQuery, mode: 'insensitive' } },
            { city: { contains: searchQuery, mode: 'insensitive' } },
            { postalCode: { contains: searchQuery, mode: 'insensitive' } },
            { country: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { keywords: { contains: searchQuery, mode: 'insensitive' } },
            { searchTerms: { contains: searchQuery, mode: 'insensitive' } },
          ],
        }
      : {};

    const addresses = await prisma.address.findMany({
      where: whereClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' }, // Default sort, can be parameterized
    });

    const total = await prisma.address.count({
      where: whereClause,
    });

    return { data: addresses, total, error: null };
  } catch (error) {
    console.error('Failed to get addresses:', error);
    return {
      data: null,
      total: 0,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Server Action: getAddressById
export async function getAddressById(id: string) {
  try {
    await ensureUser();

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return { data: null, error: 'Address not found.' };
    }

    return { data: address, error: null };
  } catch (error) {
    console.error('Failed to get address by ID:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Server Action: deleteAddress
export async function deleteAddress(id: string) {
  try {
    await ensureAdmin();

    await prisma.address.delete({
      where: { id },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to delete address:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Server Action: updateAddress
export async function updateAddress(id: string, formData: FormData) {
  try {
    await ensureUser();

    const data = Object.fromEntries(formData.entries());
    const validationResult = updateAddressSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        data: null,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: validationResult.data,
    });

    return { data: updatedAddress, error: null };
  } catch (error) {
    console.error('Failed to update address:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Server Action: createAddress
export async function createAddress(formData: FormData) {
  try {
    await ensureUser();

    const data = Object.fromEntries(formData.entries());
    const validationResult = addressSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        data: null,
        error: 'Validation failed',
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const newAddress = await prisma.address.create({
      data: validationResult.data,
    });

    return { data: newAddress, error: null };
  } catch (error) {
    console.error('Failed to create address:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
