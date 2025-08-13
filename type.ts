// import { Invoice as PrismaInvoice } from "@prisma/client";
// import { InvoiceLine } from "@prisma/client";
import { UserProduct as PrisamProduct} from "@prisma/client";
import { ProductLine } from "@prisma/client";
import { StockMovement } from "@prisma/client";

// export interface Invoice extends PrismaInvoice {
//   lines: InvoiceLine[];
// }

export interface Product extends PrisamProduct {
  productLines: ProductLine[];
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Stock extends StockMovement {
  stockLines: StockMovement[];
}