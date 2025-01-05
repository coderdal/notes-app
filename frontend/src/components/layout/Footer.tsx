import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="/legal/terms"
            className="text-gray-500 hover:text-gray-600"
          >
            Terms
          </Link>
          <Link
            href="/legal/privacy"
            className="text-gray-500 hover:text-gray-600"
          >
            Privacy
          </Link>
          <Link
            href="/legal/cookies"
            className="text-gray-500 hover:text-gray-600"
          >
            Cookies
          </Link>
          <Link
            href="/legal/acceptable-use"
            className="text-gray-500 hover:text-gray-600"
          >
            Acceptable Use
          </Link>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} Notes App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 