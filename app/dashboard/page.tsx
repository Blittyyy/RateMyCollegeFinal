"use client"

import { useState, useEffect } from "react"
import { Star, StarHalf, User, NotePencil, Warning, CheckCircle, LinkedinLogo, GraduationCap, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StickyNav } from "@/components/sticky-nav"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface UserData {
  id: string
  name: string
  email: string
  email_verified: boolean
  verification_type: 'student' | 'alumni' | null
  college_id: string | null
  linkedin_profile_id: string | null
  linkedin_verification_date: string | null
  created_at: string
}

interface Review {
  id: string
  college_id: string
  category: string
  rating: number
  comment: string
  anonymous: boolean
  created_at: string
  tags: string[] | null
  colleges: {
    name: string
    slug: string
  }
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkedinStatus, setLinkedinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [activeTab, setActiveTab] = useState<'reviews' | 'bookmarks' | 'settings'>('reviews')
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())
  const router = useRouter()

  // Animation hooks
  const headerSection = useScrollAnimation({ delay: 0 })
  const userInfoSection = useScrollAnimation({ delay: 100 })
  const reviewsSection = useScrollAnimation({ delay: 200 })

  useEffect(() => {
    // Check URL parameters for LinkedIn status
    const urlParams = new URLSearchParams(window.location.search)
    const linkedinSuccess = urlParams.get('linkedin_success')
    const linkedinError = urlParams.get('linkedin_error')

    if (linkedinSuccess === 'true') {
      setLinkedinStatus('success')
    }

    if (linkedinError) {
      setLinkedinStatus('error')
    }

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)

    // Fetch user data using Supabase auth
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...')
        // Get current user from Supabase auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        console.log('Auth result:', { user: !!user, error: authError })
        
        if (authError || !user) {
          console.error('Not authenticated, redirecting to login')
          setTimeout(() => {
            router.push('/login')
          }, 100)
          return
        }

        console.log('User authenticated, fetching user data from database...')
        // Get user data from our database
        if (!user.email) {
          console.error('User email is undefined')
          setError('User email not found')
          return
        }
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .ilike('email', user.email)
          .single()

        console.log('Database result:', { userData: !!userData, error: userError })

        if (userError) {
          console.error('Error fetching user data:', userError)
          setError('Failed to load user data')
          return
        }

        setUserData(userData)

        // Fetch user's reviews
        const { data: userReviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            colleges (
              name,
              slug
            )
          `)
          .eq('user_id', userData.id)
          .order('created_at', { ascending: false })

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError)
        } else {
          setReviews(userReviews || [])
        }

      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('An error occurred while loading your data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLinkedInConnect = () => {
    setLinkedinStatus('loading')
    window.location.href = '/api/auth/linkedin'
  }

  const toggleTagExpansion = (reviewId: string) => {
    setExpandedTags(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} weight="duotone" className="text-[#F95F62]" />
        ))}
        {hasHalfStar && <StarHalf size={16} weight="duotone" className="text-[#F95F62]" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} weight="regular" className="text-gray-300" />
        ))}
      </div>
    )
  }

  // Check if review is locked (older than 2 minutes)
  const isReviewLocked = (reviewDate: string) => {
    const reviewTime = new Date(reviewDate).getTime()
    const currentTime = new Date().getTime()
    const twoMinutesInMs = 2 * 60 * 1000
    return currentTime - reviewTime > twoMinutesInMs
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyNav />

      <div className="pt-20 pb-12">
        {/* Header Section */}
        <div
          ref={headerSection.elementRef}
          className={`relative overflow-hidden animate-fade-in-up-slow ${headerSection.isVisible ? "visible" : ""}`}
          style={{
            background: 'linear-gradient(135deg, #1b2a49, #24365e)',
            borderRadius: '0 0 1.25rem 1.25rem',
          }}
        >
          {/* Faint texture overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          <div className="relative text-white py-12 px-6 md:py-16 md:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                {/* Soft radial highlight behind profile icon */}
                <div className="relative">
                  <div className="absolute inset-0 w-20 h-20 bg-white/10 rounded-full blur-sm"></div>
                  <div className="relative w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User size={32} weight="bold" className="text-white" />
                  </div>
                </div>
                                 <div>
                   <h1 className="text-3xl md:text-4xl font-bold mb-2 relative group">
                     Welcome back, {isLoading ? 'Loading...' : userData?.name}!
                     <div className="absolute -bottom-2 left-0 h-1 bg-[#F95F62] rounded-full transition-all duration-500 ease-out group-hover:w-full w-24"></div>
                   </h1>
                   <p className="text-slate-100">Manage your reviews and profile</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Stats Cards */}
          <div
            ref={userInfoSection.elementRef}
            className={`grid md:grid-cols-3 gap-6 mb-8 animate-scale-in ${userInfoSection.isVisible ? "visible" : ""}`}
          >
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Email</p>
                  <p className="text-lg font-semibold text-[#173F5F]">{isLoading ? 'Loading...' : userData?.email}</p>
                  {userData?.email_verified && (
                    <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                  )}
                </div>
                <div className="w-12 h-12 bg-[#F95F62]/10 rounded-full flex items-center justify-center">
                  <User size={24} weight="duotone" className="text-[#F95F62]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Verification Status</p>
                  <p className="text-lg font-semibold text-[#173F5F]">
                    {isLoading ? 'Loading...' : 
                      userData?.verification_type === 'student' ? 'Verified Student' :
                      userData?.verification_type === 'alumni' ? 'Verified Alumni' :
                      'Not Verified'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} weight="duotone" className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6B7280] text-sm font-medium">Member Since</p>
                  <p className="text-lg font-semibold text-[#173F5F]">
                    {isLoading ? 'Loading...' : new Date(userData?.created_at || '').toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap size={24} weight="duotone" className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Verification Section */}
          {userData?.verification_type === 'student' && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <LinkedinLogo size={24} weight="duotone" className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-2">
                    Upgrade to Alumni Verification
                  </h3>
                  <p className="text-[#6B7280] mb-4">
                    Connect your LinkedIn account to verify your alumni status and earn a "Verified Alumni" badge. This adds extra credibility to your reviews.
                  </p>
                  
                  {linkedinStatus === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle size={20} weight="fill" />
                      <span className="font-medium">LinkedIn verification successful! You now have a "Verified Alumni" badge.</span>
                    </div>
                  )}
                  
                  {linkedinStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <Warning size={20} weight="fill" />
                      <span className="font-medium">
                        LinkedIn verification failed: {linkedinStatus === 'error' ? 'Profile verification failed' : 'Connection error'}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleLinkedInConnect}
                    disabled={linkedinStatus === 'loading'}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    {linkedinStatus === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <LinkedinLogo size={18} weight="bold" />
                        Connect LinkedIn
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-[#6B7280] mt-2">
                    We'll only access your basic profile and education information to verify your alumni status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div
            ref={reviewsSection.elementRef}
            className={`bg-white rounded-xl shadow-md border border-gray-100 animate-fade-in-up ${reviewsSection.isVisible ? "visible" : ""}`}
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "reviews", label: "My Reviews", icon: Star },
                  { id: "bookmarks", label: "Bookmarks", icon: NotePencil },
                  { id: "settings", label: "Settings", icon: User },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'reviews' | 'bookmarks' | 'settings')}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "border-[#F95F62] text-[#F95F62]"
                          : "border-transparent text-[#6B7280] hover:text-[#1F2937]"
                      }`}
                    >
                      <Icon size={18} weight="regular" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1F2937]">Your Reviews</h2>
                    <Button 
                      className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2" 
                      onClick={() => router.push('/add-review')}
                    >
                      <NotePencil size={18} weight="bold" />
                      Write New Review
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                                                 <div
                           key={review.id}
                           className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 relative"
                           style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
                         >
                           {/* Locked indicator */}
                           {isReviewLocked(review.created_at) && (
                             <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                               <Warning size={12} weight="regular" />
                               <span>Locked</span>
                             </div>
                           )}
                           <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-[#1F2937] text-lg">{review.colleges.name}</h3>
                                {review.anonymous && (
                                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                                    Anonymous
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-3">
                                {/* Display tags if available, otherwise show category */}
                                {review.tags && review.tags.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {expandedTags.has(review.id) ? (
                                      // Show all tags when expanded
                                      review.tags.map((tag) => (
                                        <span key={tag} className="bg-[#F95F62]/10 text-[#F95F62] px-2 py-1 rounded-full text-xs font-medium">
                                          {tag}
                                        </span>
                                      ))
                                    ) : (
                                      // Show first 3 tags when collapsed
                                      <>
                                        {review.tags.slice(0, 3).map((tag) => (
                                          <span key={tag} className="bg-[#F95F62]/10 text-[#F95F62] px-2 py-1 rounded-full text-xs font-medium">
                                            {tag}
                                          </span>
                                        ))}
                                        {review.tags.length > 3 && (
                                          <button
                                            onClick={() => toggleTagExpansion(review.id)}
                                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                                          >
                                            +{review.tags.length - 3} more
                                          </button>
                                        )}
                                      </>
                                    )}
                                    {expandedTags.has(review.id) && review.tags.length > 3 && (
                                      <button
                                        onClick={() => toggleTagExpansion(review.id)}
                                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                                      >
                                        Show less
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <span className="bg-[#F95F62]/10 text-[#F95F62] px-3 py-1 rounded-full font-medium">
                                    {review.category}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <GraduationCap size={14} weight="regular" />
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                {renderStars(review.rating)}
                                <span className="font-semibold text-[#1F2937]">{review.rating}/5</span>
                              </div>
                              <p className="text-[#1F2937] leading-relaxed">{review.comment}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-sm text-[#6B7280]">
                              Review posted
                            </span>
                                                         <div className="flex items-center gap-2">
                               {isReviewLocked(review.created_at) ? (
                                 <div className="flex items-center gap-2">
                                   <Button
                                     onClick={() => router.push('/contact')}
                                     className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                                   >
                                     Contact Support
                                   </Button>
                                   <div 
                                     title="Reviews are locked after 2 minutes to maintain authenticity. Contact support if you need to edit or delete this review."
                                     className="cursor-help"
                                   >
                                     <Info 
                                       size={16} 
                                       weight="regular" 
                                       className="text-gray-400" 
                                     />
                                   </div>
                                 </div>
                               ) : (
                                 <>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     className="text-[#6B7280] hover:text-[#F95F62] hover:bg-[#F95F62]/10"
                                   >
                                     <NotePencil size={16} weight="regular" />
                                     Edit
                                   </Button>
                                   <Button
                                     variant="ghost"
                                     size="sm"
                                     className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                   >
                                     <Warning size={16} weight="regular" />
                                     Delete
                                   </Button>
                                 </>
                               )}
                             </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Star size={64} weight="duotone" className="text-[#6B7280] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No reviews yet</h3>
                        <p className="text-[#6B7280] mb-6">Start sharing your college experiences with the community</p>
                        <Button 
                          className="bg-[#F95F62] hover:bg-[#e54e51] text-white" 
                          onClick={() => router.push('/add-review')}
                        >
                          <NotePencil size={18} weight="bold" />
                          Write Your First Review
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Bookmarks Tab */}
              {activeTab === 'bookmarks' && (
                <div className="text-center py-12">
                  <NotePencil size={64} weight="duotone" className="text-[#6B7280] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No bookmarks yet</h3>
                  <p className="text-[#6B7280] mb-6">Start bookmarking colleges you're interested in</p>
                  <Button 
                    className="bg-[#F95F62] hover:bg-[#e54e51] text-white" 
                    onClick={() => router.push('/colleges')}
                  >
                    <GraduationCap size={18} weight="bold" />
                    Browse Colleges
                  </Button>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1F2937]">Account Settings</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-[#1F2937] mb-4">Profile Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={userData?.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#374151] mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={userData?.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20"
                        />
                      </div>
                    </div>
                    <Button className="mt-4 bg-[#F95F62] hover:bg-[#e54e51] text-white">
                      Save Changes
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-[#1F2937] mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-[#F95F62] focus:ring-[#F95F62]" />
                        <span className="text-sm text-[#374151]">Show my name on reviews by default</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-[#F95F62] focus:ring-[#F95F62]" />
                        <span className="text-sm text-[#374151]">Allow other users to see my profile</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 