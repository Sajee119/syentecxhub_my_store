import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const getPageNumbers = () => {
    const nums = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(pages, page + 2);
    if (start > 1) nums.push(1);
    if (start > 2) nums.push('...');
    for (let i = start; i <= end; i++) nums.push(i);
    if (end < pages - 1) nums.push('...');
    if (end < pages) nums.push(pages);
    return nums;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {getPageNumbers().map((num, i) => (
        num === '...' ? (
          <span key={i} className="px-2 text-gray-500">...</span>
        ) : (
          <button key={i} onClick={() => onPageChange(num)}
            className={`min-w-[40px] h-10 rounded-xl font-medium text-sm transition-all ${num === page ? 'bg-primary-600 text-white' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {num}
          </button>
        )
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= pages}
        className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
