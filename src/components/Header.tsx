import { motion } from 'framer-motion'
import { ShoppingCart, User } from 'lucide-react'

interface HeaderProps {
  credits: number
  userRole: string | null
}

export default function Header({ credits, userRole }: HeaderProps) {
  return (
    <motion.header 
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-lg shadow-lg mb-8 sticky top-0 z-10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.h1 
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Market Place
        </motion.h1>
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-purple-600 dark:text-purple-400">{credits} credits</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-600 dark:text-gray-400">{userRole || 'Guest'}</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

