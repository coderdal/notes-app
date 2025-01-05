export const metadata = {
  title: 'Acceptable Use Policy - Notes App',
  description: 'Acceptable Use Policy for Notes App',
};

export default function AcceptableUsePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Acceptable Use Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">1. Purpose</h2>
        <p>This Acceptable Use Policy outlines the rules and guidelines for using Notes App. By using our service, you agree to comply with this policy.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">2. Prohibited Content</h2>
        <p>You agree not to create, store, share, or transmit content that:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Is illegal or promotes illegal activities</li>
          <li>Infringes on intellectual property rights</li>
          <li>Contains malware or harmful code</li>
          <li>Is discriminatory or hateful</li>
          <li>Contains personal information of others without consent</li>
          <li>Is spam or unwanted commercial content</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">3. Account Usage</h2>
        <p>Users must:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Maintain account security</li>
          <li>Not share account credentials</li>
          <li>Not attempt to access other users&apos; accounts</li>
          <li>Not use the service for automated or bulk operations without permission</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">4. System and Network Security</h2>
        <p>The following activities are prohibited:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Attempting to breach or circumvent security measures</li>
          <li>Unauthorized scanning or probing of systems</li>
          <li>Interfering with service to any user, host, or network</li>
          <li>Using the service to distribute malware</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">5. Note Sharing</h2>
        <p>When sharing notes, users must:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Respect the privacy of others</li>
          <li>Only share content they have the right to share</li>
          <li>Not use sharing features for spam or harassment</li>
          <li>Not share malicious or harmful content</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">6. Resource Usage</h2>
        <p>Users must not:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Exceed reasonable storage limits</li>
          <li>Create excessive load on our servers</li>
          <li>Attempt to circumvent any resource limitations</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">7. Enforcement</h2>
        <p>We reserve the right to:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Remove any content that violates this policy</li>
          <li>Suspend or terminate accounts for violations</li>
          <li>Report illegal activities to law enforcement</li>
          <li>Take appropriate legal action</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">8. Reporting Violations</h2>
        <p>If you encounter content or behavior that violates this policy, please report it to contact@erdal.net.tr.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">9. Changes to This Policy</h2>
        <p>We may update this Acceptable Use Policy from time to time. We will notify users of any significant changes.</p>

        <h2 className="text-xl font-semibold mt-6 mb-4">10. Contact Information</h2>
        <p>For questions about this policy, please contact us at contact@erdal.net.tr.</p>
      </div>
    </div>
  );
} 