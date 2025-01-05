import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy - Notes App',
  description: 'Privacy Policy for Notes App',
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Personal Information</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Email address (for authentication)</li>
          <li>Username</li>
          <li>Password (stored securely using hashing)</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Usage Data</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Notes and content you create</li>
          <li>Sharing preferences and settings</li>
          <li>Device and browser information</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain the Notes App service</li>
          <li>To authenticate your identity and protect your account</li>
          <li>To enable note sharing features</li>
          <li>To improve our service and user experience</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Storage and Security</h2>
        <p>We implement security measures including:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Password hashing</li>
          <li>JWT authentication</li>
          <li>Secure cookie handling</li>
          <li>CORS protection</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Cookies</h2>
        <p>We use cookies for authentication and session management. For more information, see our <Link href="/legal/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Data Sharing</h2>
        <p>We only share your notes with users you explicitly choose to share them with. We do not sell your personal information to third parties.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your notes</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">7. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">8. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at contact@erdal.net.tr.</p>
      </div>
    </div>
  );
} 