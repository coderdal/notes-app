import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy - Notes App',
  description: 'Cookie Policy for Notes App',
};

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. What Are Cookies</h2>
        <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and login status.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Cookies</h2>
        <h3 className="text-lg font-medium mt-4 mb-2">Essential Cookies</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Authentication cookies (to keep you logged in)</li>
          <li>Session cookies (to maintain your session)</li>
          <li>CSRF protection cookies</li>
        </ul>

        <h3 className="text-lg font-medium mt-4 mb-2">Functionality Cookies</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>User preferences</li>
          <li>Theme settings</li>
          <li>Language preferences</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Specific Cookies We Use</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full mt-4">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Cookie Name</th>
                <th className="text-left py-2">Purpose</th>
                <th className="text-left py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">refresh_token</td>
                <td>Authentication refresh token</td>
                <td>30 days</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">session_id</td>
                <td>Maintains user session</td>
                <td>Session</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">csrf_token</td>
                <td>CSRF protection</td>
                <td>Session</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. Managing Cookies</h2>
        <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services and functionalities may not work.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Third-Party Cookies</h2>
        <p>We do not use any third-party cookies or tracking services.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Updates to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">7. More Information</h2>
        <p>For more information about how we handle your data, please see our <Link href="/legal/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">8. Contact Us</h2>
        <p>If you have any questions about our Cookie Policy, please contact us at contact@erdal.net.tr.</p>
      </div>
    </div>
  );
} 