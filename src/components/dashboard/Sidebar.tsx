import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  {
    label: "Beranda",
    href: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
        <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.5} />
        <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
        <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    label: "Persimpangan",
    href: "/dashboard/persimpangan",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="2" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    label: "Analitik",
    href: "/dashboard/analitik",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Laporan",
    href: "/dashboard/laporan",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Status Cloud",
    href: "/dashboard/status-cloud",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-[185px] shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="text-sm font-black tracking-widest text-gray-900 uppercase">SMARTRAF</div>
        <div className="text-[10px] text-gray-400 mt-0.5 tracking-wide">IoT Controller</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm relative transition-colors ${
                isActive
                  ? "text-gray-900 font-semibold"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <div className="absolute right-0 top-1 bottom-1 w-[3px] bg-gray-900 rounded-l-full" />
              )}
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
