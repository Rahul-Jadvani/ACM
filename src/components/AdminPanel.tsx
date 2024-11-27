'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Package, Star, Zap, Trophy } from 'lucide-react'
import axios from 'axios'
import { Product } from '../services/Product'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminPanel() {
  const [productName, setProductName] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productImage, setProductImage] = useState('')
  const [listedProducts, setListedProducts] = useState<Product[]>([])
  const [adminLevel, setAdminLevel] = useState(1)
  const [adminXP, setAdminXP] = useState(0)

  useEffect(() => {
    fetchListedProducts()
  }, [])

  const fetchListedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/v1/products')
      setListedProducts(response.data)
    } catch (error) {
      console.error('Error fetching listed products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5500/api/v1/products', {
        name: productName,
        price: Number(productPrice),
        image: productImage,
        addedBy: 'admin'
      })
      setListedProducts([...listedProducts, response.data])
      setProductName('')
      setProductPrice('')
      setProductImage('')
      
      // Gamification: Increase XP and potentially level up
      const newXP = adminXP + 50
      setAdminXP(newXP)
      if (newXP >= adminLevel * 100) {
        setAdminLevel(adminLevel + 1)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-purple-50 p-6">
      <Card className="mb-8 bg-gray-800 border-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center text-purple-300">
            <Package className="mr-2 text-purple-400" /> Admin Command Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Badge variant="secondary" className="mr-2 bg-purple-700 text-purple-100">
                Level {adminLevel}
              </Badge>
              <Star className="text-yellow-400 mr-1" size={16} />
              <span className="text-purple-300">Admin Rank</span>
            </div>
            <div className="flex items-center">
              <Zap className="text-purple-400 mr-1" size={16} />
              <span className="text-purple-300">{adminXP} XP</span>
            </div>
          </div>
          <Progress value={(adminXP % 100)} className="mb-4" />
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-purple-300 mb-1">
                Product Name
              </label>
              <Input
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="bg-gray-700 border-purple-500 text-purple-100 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label htmlFor="productPrice" className="block text-sm font-medium text-purple-300 mb-1">
                Price (in credits)
              </label>
              <Input
                type="number"
                id="productPrice"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="bg-gray-700 border-purple-500 text-purple-100 focus:ring-purple-400"
                required
              />
            </div>
            <div>
              <label htmlFor="productImage" className="block text-sm font-medium text-purple-300 mb-1">
                Image URL
              </label>
              <Input
                type="text"
                id="productImage"
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                className="bg-gray-700 border-purple-500 text-purple-100 focus:ring-purple-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="mr-2" /> Deploy New Product
            </Button>
          </motion.form>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-purple-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-300 flex items-center">
            <Trophy className="mr-2 text-yellow-400" /> Product Inventory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {listedProducts.map((product) => (
              <motion.div 
                key={product.id} 
                className="flex justify-between items-center mb-2 bg-gray-700 p-3 rounded-lg border border-purple-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-purple-100">{product.name}</span>
                <Badge variant="secondary" className="bg-purple-600 text-purple-100">
                  {product.price} credits
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

