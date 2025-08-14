import React from 'react'

interface ProductsToUpdateProps {
    toUpdate: [{
        name: string;
        currentQte: number;
        minStock: number;
        unite: string;
        invoiceId: string;
        invoiceName: string;
    }];
    closeModal: () => void; // Add this line
}

const ProductsToUpdate: React.FC<ProductsToUpdateProps> = ({ toUpdate, closeModal }) => {
    return (
        <div className="p-6 max-h-96 overflow-y-auto">
            {toUpdate.length > 0 && (
                <div className="space-y-4">
                    {toUpdate.map((product, i) => (
                        <div
                            key={`${product.name}_${i}`}
                            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-semibold text-gray-800 text-lg">
                                        {product.name}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-red-600 font-bold text-lg">
                                            {product.currentQte}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {product.unite}
                                        </span>
                                        <span className="text-gray-400">/</span>
                                        <span className="text-gray-700 font-medium">
                                            {product.minStock}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            {product.unite}
                                        </span>
                                    </div>
                                    <div className="text-xs text-red-500 font-medium mt-1">
                                        {product.minStock - product.currentQte}{" "}
                                        {product.unite}  en dessous du minimum
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-3">
                                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-red-500 to-orange-400 h-full transition-all duration-300"
                                        style={{
                                            width: `${Math.min(
                                                (product.currentQte / product.minStock) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={closeModal}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                    C'est noté, je vais réapprovisionner ces articles
                </button>
            </div>
        </div>
    )
}

export default ProductsToUpdate