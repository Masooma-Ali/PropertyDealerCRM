'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/leads', label: 'All Leads', icon: '👥' },
  { href: '/admin/leads/new', label: 'Add Lead', icon: '➕' },
  { href: '/admin/agents', label: 'Agents', icon: '🧑‍💼' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

const agentLinks = [
  { href: '/agent/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/agent/leads', label: 'My Leads', icon: '👥' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : agentLinks;

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-lg">
            🏢
          </div>
          <div>
            <p className="text-white font-bold text-sm">Property CRM</p>
            <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-400 hover:text-red-400 transition px-2 py-1 rounded"
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );
}