import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '../services/Product'
import { ShoppingCartIcon as CartIcon } from 'lucide-react'

interface ShoppingCartProps {
  cart: Product[]
  onResell: (product: Product) => void
}

export default function ShoppingCart({ cart, onResell }: ShoppingCartProps) {
  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0)

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold dark:text-white flex items-center">
          <CartIcon className="mr-2" /> Shopping Cart
        </h2>
        <span className="text-purple-600 dark:text-purple-400 font-bold">
          {cart.length} item{cart.length !== 1 ? 's' : ''}
        </span>
      </div>
      {cart.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Your cart is empty</p>
      ) : (
        <>
          <AnimatePresence>
            {cart.map((product) => (
              <motion.div 
                key={product.id} 
                className="flex justify-between items-center mb-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <h3 className="font-semibold dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{product.price} credits</p>
                </div>
                <button
                  onClick={() => onResell(product)}
                  className="bg-purple-600 text-white py-1 px-3 rounded-full hover:bg-purple-700 transition duration-300 transform hover:scale-105"
                >
                  Resell
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xl font-semibold dark:text-white flex justify-between items-center">
              <span>Total:</span>
              <span className="text-purple-600 dark:text-purple-400">{totalPrice} credits</span>
            </p>
          </div>
        </>
      )}
    </motion.div>
  )
}

