"use client"

import { StickyNav } from "@/components/sticky-nav"
import { Footer } from "@/components/footer"
import { Envelope, MapPin, Phone } from "@phosphor-icons/react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <StickyNav />
      
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#173F5F] mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about RateMyCollege? We'd love to hear from you. 
            Drop us a line and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B6B] to-[#F95F62] rounded-full flex items-center justify-center mr-4">
                  <Envelope size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#173F5F]">Email Us</h3>
                  <p className="text-gray-600">We'll respond within 24 hours</p>
                </div>
              </div>
              <a 
                href="mailto:contactratemycollege@gmail.com" 
                className="text-[#FF6B6B] hover:text-[#F95F62] font-medium transition-colors duration-200"
              >
                contactratemycollege@gmail.com
              </a>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#173F5F] to-[#1a4a6b] rounded-full flex items-center justify-center mr-4">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#173F5F]">Student-First</h3>
                  <p className="text-gray-600">Was once a student, now helping future students</p>
                </div>
              </div>
              <p className="text-gray-600">
                I'm an alumni who's passionate about helping others make informed college decisions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center mr-4">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#173F5F]">Quick Response</h3>
                  <p className="text-gray-600">We're here to help</p>
                </div>
              </div>
              <p className="text-gray-600">
                Whether you have feedback, questions, or just want to chat about college life, we're all ears.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 