import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 999, size = 'md' }) {
  const sizes = { sm: { btn: 'p-1.5', icon: 'w-3 h-3', pad: 'px-3', text: 'text-sm' }, md: { btn: 'p-2.5', icon: 'w-4 h-4', pad: 'px-5', text: 'text-base' }, lg: { btn: 'p-3', icon: 'w-5 h-5', pad: 'px-6', text: 'text-lg' } };
  const s = sizes[size] || sizes.md;

  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className={`${s.btn} hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-xl`}>
        <Minus className={s.icon} />
      </button>
      <span className={`${s.pad} ${s.text} font-medium select-none`}>{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className={`${s.btn} hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-xl`}>
        <Plus className={s.icon} />
      </button>
    </div>
  );
}
