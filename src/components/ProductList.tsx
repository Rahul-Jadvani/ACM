import { motion } from 'framer-motion'
import { Product } from '../services/Product'

interface ProductListProps {
  products: Product[]
  onBuy: (product: Product) => void
}

export default function ProductList({ products, onBuy }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div 
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{product.name}</h3>
            <p className="text-purple-600 dark:text-purple-400 font-bold mb-4">{product.price} credits</p>
            <button
              onClick={() => onBuy(product)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300 transform hover:scale-105"
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

