"use client"

import { useState, useEffect } from "react"
import { List, NotePencil, UserCircle, X, SignOut } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function StickyNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check Supabase authentication state
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (user && !error) {
          setIsAuthenticated(true)
          setCurrentUser(user)
        } else {
          setIsAuthenticated(false)
          setCurrentUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
        setCurrentUser(null)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true)
          setCurrentUser(session.user)
        } else {
          setIsAuthenticated(false)
          setCurrentUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const navItems = [
    { name: "Colleges", href: "/colleges" },
    { name: "Dashboard", href: "/dashboard" },
    ...(isAuthenticated ? [] : [{ name: "Login", href: "/login" }])
  ]

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
      }
      
      // Clear local state
      setIsAuthenticated(false)
      setCurrentUser(null)
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear state and redirect
      setIsAuthenticated(false)
      setCurrentUser(null)
      router.push('/')
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[120px] bg-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-xl font-bold hover:scale-105 transition-all duration-300 ease-out"
            >
              <span className="text-[#173F5F]">RateMy</span><span className="text-[#F95F62]">College</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#1F2937] font-medium px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:bg-white/20 hover:text-[#F95F62] hover:scale-105 backdrop-blur-sm"
              >
                {item.name}
              </a>
            ))}

            {isAuthenticated && (
              <Button 
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-xl transition-all duration-300 ease-out hover:scale-105 border border-red-200 hover:border-red-300 flex items-center gap-2"
              >
                <SignOut size={18} weight="bold" />
                Logout
              </Button>
            )}

            <Button className="bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-[#F95F62]/25 flex items-center gap-2">
              <NotePencil size={18} weight="bold" className="text-white" />
              <a href={isAuthenticated ? "/add-review" : "/login"}>Add a Review</a>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#1F2937] hover:bg-white/20 hover:scale-105 transition-all duration-300 ease-out rounded-xl backdrop-blur-sm"
                >
                  <List className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="backdrop-blur-2xl bg-white/20 text-[#1F2937] border-none shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-semibold text-[#173F5F]">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-[#1F2937] hover:bg-white/20 rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium hover:text-[#F95F62] transition-all duration-300 ease-out flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/20 backdrop-blur-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name === "Login" && <UserCircle size={20} weight="regular" className="text-[#6B7280]" />}
                      {item.name}
                    </a>
                  ))}

                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="text-lg font-medium text-red-600 hover:text-red-700 transition-all duration-300 ease-out flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 backdrop-blur-sm border border-red-200 hover:border-red-300"
                    >
                      <SignOut size={20} weight="bold" />
                      Logout
                    </button>
                  )}

                  <Button
                    className="bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg flex items-center gap-3 justify-start mt-6"
                    onClick={() => setIsOpen(false)}
                  >
                    <NotePencil size={20} weight="bold" className="text-white" />
                    <a href={isAuthenticated ? "/add-review" : "/login"}>Add a Review</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
