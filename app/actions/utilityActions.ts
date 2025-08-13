"use server"

import prisma from "../lib/prisma";
import { randomBytes } from "crypto";

export const generateInvoiceId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = randomBytes(4).toString("hex");

    const existingInvoice = await prisma.userProduct.findUnique({
      where: { id: uniqueId },
    });

    if (!existingInvoice) {
      isUnique = true;
    }
  }
  return uniqueId;
};

export const generateProductId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = randomBytes(3).toString("hex");

    const existingProduct = await prisma.userProduct.findUnique({
      where: { id: uniqueId },
    });

    if (!existingProduct) {
      isUnique = true;
    }
  }
  return uniqueId;
};