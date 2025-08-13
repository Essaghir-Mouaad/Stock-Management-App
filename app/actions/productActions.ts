import { Product } from "@/type";
import prisma from "../lib/prisma";
// import { generateProductId } from "./utilityActions";

export async function initialiseProductInvoice(email: string, name: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const productInvoiceID = Date.now().toString(); // Temporary fix

      const newProductInvoice = await prisma.userProduct.create({
        data: {
          id: productInvoiceID,
          name,
          createdAt: new Date(),
          createdById: user.id,
        },
      });

      // Then fetch with include if needed
      const resultWithLines = await prisma.userProduct.findUnique({
        where: { id: newProductInvoice.id },
        include: { productLines: true },
      });

      return resultWithLines;
    } else {
      console.error("Utilisateur introuvable pour :", email);
      return null;
    }
  } catch (error) {
    console.error("Error in initialiseProductInvoice:", error);
    throw error;
  }
}

export async function getInvoiceProductByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userProducts: {
          include: {
            productLines: true,
          },
        },
      },
    });

    return user?.userProducts || [];
  } catch (error) {
    console.error("Error fetching product invoices by email:", error);
    return [];
  }
}

export async function getProductsById(invoiceId: string) {
  try {
    const produt = await prisma.userProduct.findUnique({
      where: { id: invoiceId },
      include: {
        productLines: true,
      },
    })

    if (!produt) {
      throw new Error("Product not found");
    }

    return produt;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;

  }
}

// export async function updatedProducts(product: Product) {
//   return await prisma.$transaction(async (tx) => {
//     try {
//       console.log("transction star for the id ", product.id);

//       if (!product.id) {
//         throw new Error("product invoice id require")
//       }

//       const existingProducts = await tx.userProduct.findUnique({
//         where: { id: product.id },
//         include: {
//           productLines: true
//         }
//       });

//       if (!existingProducts) {
//         throw new Error("product invoice id not exist at all")
//       }

//       // Update main invoice
//       await tx.userProduct.update({
//         where: { id: product.id },
//         data: {
//           name: product.name,
//           createdAt: product.createdAt,
//         },
//       });

//       const existingProductLines = existingProducts.productLines
//       const receiveProductLines = product.productLines || []

//       const realExistingLines = receiveProductLines.filter((line) => line.id && existingProductLines.some((existing) => existing.id === line.id))

//       const newLinesToCreate = receiveProductLines.filter(
//         (line) =>
//           !line.id ||
//           !existingProductLines.some((existing) => existing.id === line.id)
//       );

//       // SUPPRESSION avec gestion des contraintes
//       const linesToDelete = existingProductLines.filter(
//         (existingLine) =>
//           !realExistingLines.some(
//             (receivedLine) => receivedLine.id === existingLine.id
//           )
//       );

//       if (linesToDelete.length > 0) {
//         console.log(
//           `Deleting ${linesToDelete.length} lines`
//         );

//         await tx.stockMovement.deleteMany({
//           where: {
//             productLineId: { in: linesToDelete.map((l) => l.id) }
//           }
//         })

//         // Puis supprimer les lignes de produits
//         await tx.productLine.deleteMany({
//           where: {
//             id: { in: linesToDelete.map((line) => line.id) },
//           },
//         });

//         console.log(
//           `Successfully deleted ${linesToDelete.length} lines`
//         );
//       }


//       // MISE À JOUR des lignes existantes
//       for (const line of realExistingLines) {
//         const existingLine = existingProductLines.find((l) => l.id === line.id);

//         if (!existingLine) continue;

//         // Enregistrer mouvement de stock si nécessaire
//         if (line.currentStock !== existingLine.currentStock) {
//           const diff = line.currentStock - existingLine.currentStock;
//           const movementType = diff >= 0 ? "IN" : "OUT";
//           const newStock =
//             movementType === "IN"
//               ? existingLine.currentStock + Math.abs(diff)
//               : existingLine.currentStock - Math.abs(diff);

//           await tx.stockMovement.create({
//             data: {
//               userId: product.createdById,
//               userProductId: product.id,
//               productLineId: line.id,
//               movementType,
//               quantity: Math.abs(diff),
//               previousStock: existingLine.currentStock,
//               newStock,

//             },
//           });
//         }

//         // Mettre à jour la ligne
//         const hasChanges =
//           line.currentStock !== existingLine.currentStock ||
//           line.minStock !== existingLine.minStock ||
//           line.name !== existingLine.name ||
//           line.initialStock !== existingLine.initialStock ||
//           line.unitPrice !== existingLine.unitPrice ||
//           line.quality !== existingLine.quality ||
//           line.unite !== existingLine.unite ||
//           line.category !== existingLine.category;

//         if (hasChanges) {
//           await tx.productLine.update({
//             where: { id: line.id },
//             data: {
//               name: line.name,
//               quality: line.quality,
//               initialStock: line.initialStock,
//               currentStock: line.currentStock,
//               minStock: line.minStock,
//               unitPrice: line.unitPrice,
//               unite: line.unite,
//               category: line.category
//             },
//           });
//         }
//       }

//       // CRÉATION des nouvelles lignes
//       for (const line of newLinesToCreate) {
//         const createdLine = await tx.productLine.create({
//           data: {
//             name: line.name,
//             quality: line.quality,
//             initialStock: line.initialStock,
//             currentStock: line.currentStock,
//             minStock: line.minStock,
//             unitPrice: line.unitPrice,
//             unite: line.unite,
//           },
//         });

//         // Enregistrer mouvement de stock initial si nécessaire
//         if (createdLine.currentStock > 0) {
//           await tx.stockMovement.create({
//             data: {
//               userId: product.createdById,
//               userProductId: product.id,
//               productLineId: createdLine.id,
//               movementType: "IN",
//               quantity: createdLine.currentStock,
//               previousStock: 0,
//               newStock: createdLine.currentStock,
//             },
//           });
//         }
//       }

//       console.log("Transaction completed successfully");
//       return {
//         success: true,
//         message: "Invoice updated successfully",
//         stats: {
//           deleted: linesToDelete.length,
//           updated: realExistingLines.length,
//           created: newLinesToCreate.length,
//         },
//       };
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       throw error; // La transaction sera automatiquement annulée
//     }
//   });
// };


export const deleteProductInvoice = async (InvoiceId: string) => {
  try {
    const existingInvoice = await prisma.userProduct.findUnique({
      where: { id: InvoiceId },
    });

    if (!existingInvoice) {
      throw new Error(`The Invoice with the Id ${InvoiceId} does not exist`);
    }

    const deletedInvoice = await prisma.userProduct.delete({
      where: { id: InvoiceId },
    });

    if (!deletedInvoice) throw new Error("Can't delete the Invoice");
  } catch (error) {
    console.error("Error deleting product invoice:", error);
  }
};

// Add new function to delete a specific product line
export const deleteProductLine = async (productLineId: string) => {
  try {
    const existingProductLine = await prisma.productLine.findUnique({
      where: { id: productLineId },
    });

    if (!existingProductLine) {
      throw new Error(`The Product Line with the Id ${productLineId} does not exist`);
    }

    // Delete associated stock movements first
    await prisma.stockMovement.deleteMany({
      where: { productLineId: productLineId },
    });

    // Delete the product line
    const deletedProductLine = await prisma.productLine.delete({
      where: { id: productLineId },
    });

    if (!deletedProductLine) throw new Error("Can't delete the Product Line");

    return deletedProductLine;
  } catch (error) {
    console.error("Error deleting product line:", error);
    throw error;
  }
};

// Add new function to update a specific product line
export const updateProductLine = async (productLineId: string, updateData: any) => {
  try {
    console.log("updateProductLine called with:", productLineId, updateData);

    const existingProductLine = await prisma.productLine.findUnique({
      where: { id: productLineId },
    });

    console.log("Existing product line:", existingProductLine);

    if (!existingProductLine) {
      throw new Error(`The Product Line with the Id ${productLineId} does not exist`);
    }

    console.log("Updating product line with data:", updateData);
    const updatedProductLine = await prisma.productLine.update({
      where: { id: productLineId },
      data: updateData,
    });

    console.log("Updated product line result:", updatedProductLine);
    return updatedProductLine;
  } catch (error) {
    console.error("Error updating product line:", error);
    throw error;
  }
};