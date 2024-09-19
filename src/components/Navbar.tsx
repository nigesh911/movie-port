'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  }

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="hidden md:flex space-x-4">
          {['/', '/trending', '/watched', '/movie-talks'].map((path) => (
            <Link 
              key={path} 
              href={path} 
              className={`hover:text-accent transition-colors duration-300 ${isActive(path) ? 'text-accent font-bold' : ''}`}
            >
              {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="flex items-center">
          {!isLoading && (
            user ? (
              <Link href="/profile" className="hover:text-accent transition-colors duration-300">
                Profile
              </Link>
            ) : (
              <Link href="/api/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300">
                Log In
              </Link>
            )
          )}
        </div>
      </div>
      {isOpen && (
        <motion.div 
          className="md:hidden mt-4 space-y-2"
          initial="closed"
          animate="open"
          variants={menuVariants}
        >
          {['/', '/trending', '/watched', '/movie-talks'].map((path) => (
            <Link 
              key={path} 
              href={path} 
              className={`block hover:text-accent transition-colors duration-300 ${isActive(path) ? 'text-accent font-bold' : ''}`}
            >
              {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}