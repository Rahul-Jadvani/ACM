import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, ShoppingBag, Package, RefreshCw, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'

interface SidebarProps {
  userRole: string | null
  setActiveView: (view: 'products' | 'secondHand' | 'adminPanel') => void
}

export default function Sidebar({ userRole, setActiveView }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <motion.div 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg z-50 ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}
      animate={{ width: isOpen ? 256 : 64 }}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-3 p-1 rounded-full bg-purple-600 text-white shadow-lg"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      <nav className="flex flex-col h-full p-4">
        <motion.div 
          className="flex items-center mb-8 justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <ShoppingBag className="h-8 w-8 text-purple-600" />
          {isOpen && <span className="ml-2 text-xl font-bold">Marketplace</span>}
        </motion.div>
        <SidebarButton icon={Package} label="Products" onClick={() => setActiveView('products')} isOpen={isOpen} />
        <SidebarButton icon={RefreshCw} label="Second-Hand" onClick={() => setActiveView('secondHand')} isOpen={isOpen} />
        <SidebarButton icon={UserCircle} label="Profile" onClick={() => {}} isOpen={isOpen} />
        {userRole === 'admin' && (
          <SidebarButton icon={Package} label="Admin Panel" onClick={() => setActiveView('adminPanel')} isOpen={isOpen} />
        )}
        <SidebarButton 
          icon={theme === 'dark' ? Sun : Moon}
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          isOpen={isOpen}
          className="mt-auto"
        />
      </nav>
    </motion.div>
  )
}

interface SidebarButtonProps {
  icon: React.ElementType
  label: string
  onClick: () => void
  isOpen: boolean
  className?: string
}

function SidebarButton({ icon: Icon, label, onClick, isOpen, className = '' }: SidebarButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center mb-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors duration-200 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="h-6 w-6" />
      {isOpen && <span className="ml-2">{label}</span>}
    </motion.button>
  )
}

