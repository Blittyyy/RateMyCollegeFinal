"use client"

import { StickyNav } from "@/components/sticky-nav"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <StickyNav />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-[#173F5F] mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information you provide directly to us, such as when you create an account, submit a review, or contact us for support.
            </p>
            <h3 className="text-xl font-semibold text-[#173F5F] mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email address and password (for account creation)</li>
              <li>Name and profile information (optional)</li>
              <li>College affiliation and graduation year (optional)</li>
              <li>Review content and ratings you submit</li>
            </ul>
            <h3 className="text-xl font-semibold text-[#173F5F] mb-3">Usage Information</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Pages you visit and features you use</li>
              <li>Search queries and college preferences</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and display your reviews and ratings</li>
              <li>Personalize your experience and show relevant content</li>
              <li>Communicate with you about your account or our services</li>
              <li>Detect and prevent fraud, abuse, and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">3. Information Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Public Reviews:</strong> Your reviews and ratings are displayed publicly on our platform</li>
              <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our platform</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may be transferred</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">5. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our platform</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookie settings through your browser preferences, though disabling cookies may affect some features of our platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Correct inaccurate information</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we may retain certain information for a limited time to comply with legal obligations or resolve disputes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">9. International Users</h2>
            <p className="text-gray-700 mb-4">
              If you are accessing our platform from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located and our central database is operated.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#173F5F] mb-4">11. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
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