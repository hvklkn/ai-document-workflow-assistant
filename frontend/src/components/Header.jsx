import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/documents': 'Documents',
  '/ask': 'Ask AI',
  '/history': 'History',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'AI Document Assistant';

  return (
    <header className="h-14 flex-shrink-0 flex items-center justify-between
                       px-6 bg-gray-900 border-b border-gray-800">
      <h1 className="text-base font-semibold text-white">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="badge bg-green-900 text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 inline-block" />
          Backend connected
        </span>
      </div>
    </header>
  );
}
