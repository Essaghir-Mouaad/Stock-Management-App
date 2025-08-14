import prisma from "../lib/prisma";

// Get daily stock movements for a specific date range
export async function getDailyMovements(startDate: Date, endDate: Date, userId?: string) {
    try {
        const whereClause: any = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (userId) {
            whereClause.userId = userId;
        }

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: {
                    include: {
                        userProduct: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Group by date and calculate daily totals
        const dailyData = movements.reduce((acc, movement) => {
            const date = movement.createdAt.toISOString().split('T')[0];

            if (!acc[date]) {
                acc[date] = {
                    date,
                    stockIn: 0,
                    stockOut: 0,
                    net: 0,
                    movements: [],
                };
            }

            if (movement.movementType === 'IN') {
                acc[date].stockIn += movement.quantity;
                acc[date].net += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                acc[date].stockOut += movement.quantity;
                acc[date].net -= movement.quantity;
            }

            acc[date].movements.push(movement);
            return acc;
        }, {} as any);

        return Object.values(dailyData);
    } catch (error) {
        console.error("Error fetching daily movements:", error);
        throw error;
    }
}

// Get monthly summary for analytics
export async function getMonthlySummary(year: number, month: number, userId?: string) {
    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const whereClause: any = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (userId) {
            whereClause.userId = userId;
        }

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: {
                    include: {
                        userProduct: true,
                    },
                },
                user: true,
            },
        });

        // Calculate monthly totals
        const monthlyData = movements.reduce((acc, movement) => {
            if (movement.movementType === 'IN') {
                acc.totalIn += movement.quantity;
                acc.net += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                acc.totalOut += movement.quantity;
                acc.net -= movement.quantity;
            }
            return acc;
        }, {
            totalIn: 0,
            totalOut: 0,
            net: 0,
            movementCount: movements.length,
        });

        return {
            year,
            month,
            ...monthlyData,
            averageDaily: monthlyData.movementCount / new Date(year, month, 0).getDate(),
        };
    } catch (error) {
        console.error("Error fetching monthly summary:", error);
        throw error;
    }
}

// Get yearly report with all months
export async function getYearlyReport(year: number, userId?: string) {
    try {
        const monthlyData = [];

        for (let month = 1; month <= 12; month++) {
            const monthData = await getMonthlySummary(year, month, userId);
            monthlyData.push({
                month,
                monthName: new Date(year, month - 1, 1).toLocaleString('default', { month: 'short' }),
                ...monthData,
            });
        }

        const yearlyTotals = monthlyData.reduce((acc, month) => {
            acc.totalIn += month.totalIn;
            acc.totalOut += month.totalOut;
            acc.net += month.net;
            acc.totalMovements += month.movementCount;
            return acc;
        }, {
            totalIn: 0,
            totalOut: 0,
            net: 0,
            totalMovements: 0,
        });

        return {
            year,
            monthlyData,
            yearlyTotals,
        };
    } catch (error) {
        console.error("Error fetching yearly report:", error);
        throw error;
    }
}

// Get category statistics
export async function getCategoryStats(startDate: Date, endDate: Date, userId?: string) {
    try {
        const whereClause: any = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (userId) {
            whereClause.userId = userId;
        }

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: true,
            },
        });

        // Group by category and calculate statistics
        const categoryStats = movements.reduce((acc, movement) => {
            const category = movement.productLine.category;

            if (!acc[category]) {
                acc[category] = {
                    name: category,
                    totalIn: 0,
                    totalOut: 0,
                    net: 0,
                    movementCount: 0,
                    products: new Set(),
                };
            }

            if (movement.movementType === 'IN') {
                acc[category].totalIn += movement.quantity;
                acc[category].net += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                acc[category].totalOut += movement.quantity;
                acc[category].net -= movement.quantity;
            }

            acc[category].movementCount++;
            acc[category].products.add(movement.productLine.name);

            return acc;
        }, {} as any);

        // Convert to array and calculate percentages
        const totalMovements = Object.values(categoryStats).reduce((sum: number, cat: any) => sum + cat.movementCount, 0);

        return Object.values(categoryStats).map((cat: any) => ({
            ...cat,
            products: Array.from(cat.products),
            percentage: totalMovements > 0 ? (cat.movementCount / totalMovements) * 100 : 0,
        }));
    } catch (error) {
        console.error("Error fetching category stats:", error);
        throw error;
    }
}

// Get top performing products
export async function getProductPerformance(startDate: Date, endDate: Date, userId?: string, limit: number = 10) {
    try {
        const whereClause: any = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (userId) {
            whereClause.userId = userId;
        }

        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: {
                    include: {
                        userProduct: true,
                    },
                },
            },
        });

        // Group by product and calculate performance
        const productStats = movements.reduce((acc, movement) => {
            const productId = movement.productLine.id;

            if (!acc[productId]) {
                acc[productId] = {
                    id: productId,
                    name: movement.productLine.name,
                    category: movement.productLine.category,
                    totalIn: 0,
                    totalOut: 0,
                    net: 0,
                    unite: movement.productLine.unite,
                    movementCount: 0,
                    currentStock: movement.productLine.currentStock,
                    unitPrice: movement.productLine.unitPrice,
                };
            }

            if (movement.movementType === 'IN') {
                acc[productId].totalIn += movement.quantity;
                acc[productId].net += movement.quantity;
            } else if (movement.movementType === 'OUT') {
                acc[productId].totalOut += movement.quantity;
                acc[productId].net -= movement.quantity;
            }

            acc[productId].movementCount++;
            return acc;
        }, {} as any);

        // Convert to array and sort by movement count
        const sortedProducts = Object.values(productStats)
            .sort((a: any, b: any) => b.movementCount - a.movementCount)
            .slice(0);

        return sortedProducts;
    } catch (error) {
        console.error("Error fetching product performance:", error);
        throw error;
    }
}

// Get current stock overview
export async function getCurrentStockOverview(startDate: Date, endDate: Date, userId?: string) {
    try {
        const whereClause: any = {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (userId) {
            whereClause.userId = userId;
        }

        // Get stock movements in date range
        const movements = await prisma.stockMovement.findMany({
            where: whereClause,
            include: {
                productLine: {
                    include: {
                        userProduct: true,
                    },
                },
            },
        });

        // Get unique products from movements
        const productMap = new Map();
        movements.forEach(movement => {
            const product = movement.productLine;
            if (!productMap.has(product.id)) {
                productMap.set(product.id, product);
            }
        });

        const products = Array.from(productMap.values());

        const overview = products.reduce((acc, product) => {
            acc.totalProducts++;
            acc.totalStockValue += (product.currentStock || 0) * (product.unitPrice || 0);

            if ((product.currentStock || 0) <= (product.minStock || 0)) {
                acc.lowStockProducts++;
            }

            if ((product.currentStock || 0) > (product.initialStock || 0) * 0.8) {
                acc.highStockProducts++;
            }

            return acc;
        }, {
            totalProducts: 0,
            totalStockValue: 0,
            lowStockProducts: 0,
            highStockProducts: 0,
        });

        return overview;
    } catch (error) {
        console.error("Error fetching current stock overview:", error);
        throw error;
    }
}
// Get forecasting data based on historical trends
export async function getForecastingData(productId: string, days: number = 30) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const movements = await prisma.stockMovement.findMany({
            where: {
                productLineId: productId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Calculate daily averages
        const dailyOutflow = movements
            .filter(m => m.movementType === 'OUT')
            .reduce((sum, m) => sum + m.quantity, 0) / days;

        const currentProduct = await prisma.productLine.findUnique({
            where: { id: productId },
        });

        if (!currentProduct) {
            throw new Error("Product not found");
        }

        // Calculate days until stockout
        const daysUntilStockout = dailyOutflow > 0 ? Math.floor(currentProduct.currentStock / dailyOutflow) : 0;

        return {
            productId,
            currentStock: currentProduct.currentStock,
            dailyOutflow,
            daysUntilStockout,
            recommendedOrder: dailyOutflow * 7, // Weekly order recommendation
        };
    } catch (error) {
        console.error("Error fetching forecasting data:", error);
        throw error;
    }
} 
