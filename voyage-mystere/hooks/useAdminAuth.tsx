'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface Admin {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'super_admin'
  isActive: boolean
}

interface AdminAuthContextType {
  admin: Admin | null
  loading: boolean
  signOut: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  loading: true,
  signOut: () => {},
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = Cookies.get('admin_token')

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAdmin(data.admin)
      } else {
        Cookies.remove('admin_token')
        setAdmin(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('admin_token')
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    const token = Cookies.get('admin_token')
    if (token) {
      fetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }
    Cookies.remove('admin_token')
    setAdmin(null)
    router.push('/admin/login')
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
