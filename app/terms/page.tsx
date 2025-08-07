"use client"

import { StickyNav } from "@/components/sticky-nav"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <StickyNav />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#173F5F] mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using RateMyCollege ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              RateMyCollege is a platform that allows students to share honest reviews and ratings about their college experiences. The Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>College review submission and publication</li>
              <li>College search and comparison tools</li>
              <li>Rating aggregation and display</li>
              <li>Community features and discussions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">As a user of RateMyCollege, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide accurate and truthful information</li>
              <li>Respect the privacy and rights of others</li>
              <li>Not submit false, misleading, or defamatory content</li>
              <li>Not use the Service for any illegal or unauthorized purpose</li>
              <li>Not attempt to gain unauthorized access to the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">4. Content Guidelines</h2>
            <p className="text-gray-700 mb-4">
              All content submitted to RateMyCollege must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Be based on genuine personal experiences</li>
              <li>Be respectful and constructive</li>
              <li>Not contain personal information about other individuals</li>
              <li>Not violate any applicable laws or regulations</li>
              <li>Not contain spam, advertising, or promotional content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content, features, and functionality are owned by RateMyCollege and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">6. Privacy</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">7. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              In no event shall RateMyCollege, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">10. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-gray-700">
              Email: contactratemycollege@gmail.com
            </p>
          </section>
        </div>
      </main>
    </div>
  )
} 