'use client'

import { ThemeProvider } from "next-themes"
import { useState, useEffect } from 'react'
import Marketplace from '@/components/Marketplace'
import Sidebar from '@/components/Sidebar'
import AdminPanel from '@/components/AdminPanel'
import axios from 'axios'

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [credits, setCredits] = useState(1000)
  const [activeView, setActiveView] = useState<'products' | 'secondHand' | 'adminPanel'>('products')

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Fetch token from local storage (assuming it's stored there after login)
        const token = localStorage.getItem('authToken')

        if (!token) {
          console.error('No token found. User is not authenticated.')
          return
        }

        // Make a request to the /get-role API with the token
        const response = await axios.get('http://localhost:5500/api/v1/user/get-role', {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        })

        // Retrieve only the role and credits data from the response
        if (response.data.success) {
          setUserRole(response.data.role)  // Set the role of the user
          setCredits(response.data.credits || 1000)  // Set credits if provided by API
        } else {
          console.error('Failed to retrieve user role.')
        }
      } catch (error) {
        console.error('Error checking user role:', error)
      }
    }

    checkUserRole()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar userRole={userRole} setActiveView={setActiveView} />
        <main className="flex-1 p-8 ml-16 md:ml-64 transition-all duration-300 ease-in-out">
          {/* Conditionally render AdminPanel only if user is an admin */}
          {activeView === 'adminPanel' && userRole === 'admin' && <AdminPanel />}
          {/* Marketplace component will be rendered for both 'admin' and 'user' roles */}
          <Marketplace userRole={userRole} initialCredits={credits} activeView={activeView} />
        </main>
      </div>
    </ThemeProvider>
  )
}
