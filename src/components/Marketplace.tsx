'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import ProductList from './ProductList'
import ShoppingCart from './ShoppingCart'
import SearchBar from './SearchBar'
import SecondHandMarket from './SecondHandMarket'
import { Product } from '../services/Product'
import { sampleProducts } from '../../utils/sampleProducts'
import axios from 'axios'
import Navbar from './landing/Navbar'

interface MarketplaceProps {
  userRole: string | null
  initialCredits: number
  activeView: 'products' | 'secondHand' | 'adminPanel'
}

export default function Marketplace({ userRole, initialCredits, activeView }: MarketplaceProps) {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [cart, setCart] = useState<Product[]>([])
  const [credits, setCredits] = useState(initialCredits)
  const [searchTerm, setSearchTerm] = useState("")
  const [secondHandMarket, setSecondHandMarket] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/v1/products')
      setProducts([...sampleProducts, ...response.data])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBuy = (product: Product) => {
    if (credits >= product.price) {
      setCredits(credits - product.price)
      setCart([...cart, product])
      setProducts(products.filter(p => p.id !== product.id))
    } else {
      alert("Not enough credits!")
    }
  }

  const handleResell = (product: Product) => {
    const resellPrice = Math.floor(product.price * 0.8)
    setSecondHandMarket([...secondHandMarket, { ...product, price: resellPrice }])
    setCart(cart.filter(p => p.id !== product.id))
    setCredits(credits + resellPrice)
  }

  const handleBuySecondHand = (product: Product) => {
    if (credits >= product.price) {
      setCredits(credits - product.price)
      setCart([...cart, product])
      setSecondHandMarket(secondHandMarket.filter(p => p.id !== product.id))
    } else {
      alert("Not enough credits!")
    }
  }

  return (
    <div>
      <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <Header credits={credits} userRole={userRole} />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex flex-col lg:flex-row gap-8">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeView}
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'products' && (
              <ProductList products={filteredProducts} onBuy={handleBuy} />
            )}
            {activeView === 'secondHand' && (
              <SecondHandMarket products={secondHandMarket} onBuy={handleBuySecondHand} />
            )}
          </motion.div>
        </AnimatePresence>
        <motion.div 
          className="w-full lg:w-1/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ShoppingCart cart={cart} onResell={handleResell} />
        </motion.div>
      </div>
    </div>
    </div>
  )
}
