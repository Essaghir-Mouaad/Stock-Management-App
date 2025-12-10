export interface Movement {
  id: string;
  productLineId: string;
  movementType: "IN" | "OUT";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userProductId: string;
  createdAt: string;
  productLine: {
    id: string;
    name: string;
    quality: number;
    category: string;
    unitPrice: number;
    initialStock: number;
    currentStock: number;
    minStock: number;
    unite: string;
    userProductId: string;
    userProduct: {
      id: string;
      name: string;
      createdAt: string;
      createdById: string;
    };
  };
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface DailyData {
  date: string;
  stockIn: number;
  stockOut: number;
  net: number;
  movements: Movement[];
  movementCount: number; // ← Add this missing property
}