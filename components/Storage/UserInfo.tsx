'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import NotificationPanel from './NotificationPanel';

function UserInfo() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session) return null;

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Clickable Profile Container */}
      <div
        className="w-full flex items-center gap-3 cursor-pointer bg-white p-4 rounded-md shadow-sm hover:bg-gray-50 transition"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Image
          src={session.user.image || '/default-profile.jpg'}
          alt="User"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold text-sm sm:text-base truncate">
            {session.user.name}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm truncate">
            {session.user.email}
          </span>
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white border rounded-lg shadow-md z-50 text-sm overflow-hidden">
          <button
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
                6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 
                6.165 6 8.388 6 11v3.159c0 .538-.214 
                1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 
                0v-1m6 0H9"
              />
            </svg>
            Your Notifications
          </button>

          <button
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-red-500 transition"
            onClick={() => signOut()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 
                01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 
                2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
