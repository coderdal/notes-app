'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DocumentTextIcon, 
  ArchiveBoxIcon, 
  ShareIcon, 
  PencilSquareIcon,
  CommandLineIcon,
  ServerIcon,
  KeyIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features = [
  {
    name: 'Rich Text Editing',
    description: 'Write notes in Markdown and MDX with real-time preview.',
    icon: PencilSquareIcon,
  },
  {
    name: 'Organization',
    description: 'Keep your notes organized with active, archive, and trash states.',
    icon: DocumentTextIcon,
  },
  {
    name: 'Easy Sharing',
    description: 'Share notes with others through secure, customizable links.',
    icon: ShareIcon,
  },
  {
    name: 'Smart Archive',
    description: 'Archive important notes for later reference without deletion.',
    icon: ArchiveBoxIcon,
  },
];

const techStack = [
  {
    name: 'Next.js Frontend',
    description: 'Modern React framework with server-side rendering',
    icon: CommandLineIcon,
  },
  {
    name: 'Node.js Backend',
    description: 'Express.js server with RESTful API',
    icon: ServerIcon,
  },
  {
    name: 'JWT Authentication',
    description: 'Secure authentication with token rotation',
    icon: KeyIcon,
  },
  {
    name: 'PostgreSQL & Cloud',
    description: 'Reliable data storage and cloud infrastructure',
    icon: CloudIcon,
  },
];

const screenshots = [
  {
    title: 'Powerful MDX Editor',
    description: 'Write and format your notes with our intuitive MDX editor. Enjoy real-time preview, syntax highlighting, and support for code blocks.',
    imagePath: '/screenshots/editor.png',
  },
  {
    title: 'Smart Organization',
    description: 'Keep your notes organized with our flexible system. Use folders, and smart filters to find what you need, when you need it.',
    imagePath: '/screenshots/organization.png',
  },
  {
    title: 'Secure Collaboration',
    description: 'Share notes with people while maintaining control. Set expiration dates, and track shared note activity.',
    imagePath: '/screenshots/sharing.png',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/notes');
    }
  }, [user]);

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-stone-950">Notes App</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/notes"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-stone-950 hover:bg-stone-800 transition-colors"
                >
                  Go to Notes
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-stone-700 hover:text-stone-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-stone-950 hover:bg-stone-800 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left pt-16">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Take notes with</span>
                  <span className="block text-stone-950">power and simplicity</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A modern note-taking application that helps you capture your thoughts, organize your life, and share your ideas. With Markdown and MDX support.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-stone-950 hover:bg-stone-800 transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Get started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-stone-300 text-base font-medium rounded-md text-stone-700 bg-white hover:bg-stone-50 transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Screenshots Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-stone-950 font-semibold tracking-wide uppercase">Screenshots</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              See it in action
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Take a look at the powerful features that make Notes App stand out.
            </p>
          </div>
          
          <div className="mt-16 space-y-12">
            {screenshots.map((screenshot, index) => (
              <div
                key={screenshot.title}
                className={`lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden">
                    <img
                      src={screenshot.imagePath}
                      alt={screenshot.title}
                      className="object-cover object-center"
                    />
                  </div>
                </div>
                <div className={`mt-6 lg:mt-0 ${
                  index % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'
                }`}>
                  <h3 className="text-2xl font-bold text-gray-900">{screenshot.title}</h3>
                  <p className="mt-3 text-lg text-gray-500">{screenshot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-stone-950 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your notes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              A comprehensive suite of features designed to make note-taking efficient and enjoyable.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-stone-900 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-stone-950 font-semibold tracking-wide uppercase">Tech Stack</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Built with modern technologies
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Leveraging the latest web technologies for optimal performance and developer experience.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {techStack.map((tech) => (
                <div key={tech.name} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-stone-900 text-white">
                    <tech.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{tech.name}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Section */}
      <div className="bg-stone-900">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-stone-400 tracking-wide uppercase">
              Open Source
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight">
              Check out the code
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-stone-400">
              This project is open source and available on GitHub. Feel free to explore the code, submit issues, or contribute.
            </p>
            <div className="mt-8">
              <a
                href="https://github.com/coderdal/notes-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-stone-900 bg-white hover:bg-stone-50 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
