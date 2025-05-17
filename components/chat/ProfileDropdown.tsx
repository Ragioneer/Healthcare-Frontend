"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FC, useState, useRef, useEffect } from "react";
import { CiLogout } from "react-icons/ci";

type ProfileDropdownProps = {
  email: string;
};

const ProfileDropdown: FC<ProfileDropdownProps> = ({ email }) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setOpen(false);

    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 border-2 border-primary hover:border-secondary bg-primary rounded-full p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 hover:shadow-md"
        aria-label="Profile menu"
        aria-expanded={open}
      >
        <Image
          src="/images/mefIA/mefIALogoCollapsedLogo.png"
          alt="User profile"
          width={40}
          height={40}
          className="rounded-full w-10 h-10 object-cover border border-gray-200"
        />
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-200 ease-in-out ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {open && (
          <>
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900 truncate">{email}</p>
            </div>

            <button
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150 text-left"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <CiLogout size={18} className="text-gray-500" />
              <span>Log out</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
