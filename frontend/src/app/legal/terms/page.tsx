import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - Notes App',
  description: 'Terms of Service for Notes App',
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using Notes App, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Description of Service</h2>
        <p>Notes App is a note-taking application that allows users to create, edit, store, and share notes. The service includes features such as MDX editing, and note sharing capabilities.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. User Accounts</h2>
        <p>To use Notes App, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. User Content</h2>
        <p>You retain all rights to the content you create and store in Notes App. By using our service, you grant us a license to host and share your content according to your settings.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Acceptable Use</h2>
        <p>You agree not to use Notes App for any unlawful purposes or in violation of our Acceptable Use Policy.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Privacy and Data Protection</h2>
        <p>Your use of Notes App is also governed by our <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">7. Service Modifications</h2>
        <p>We reserve the right to modify or discontinue Notes App at any time, with or without notice.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">8. Limitation of Liability</h2>
        <p>Notes App is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the service.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">9. Contact Information</h2>
        <p>For any questions about these Terms, please contact us at contact@erdal.net.tr.</p>
      </div>
    </div>
  );
} 