import { LayoutGrid, List } from 'lucide-react';

export default function TaskFilters({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
  view,
  setView,
  suggestions = []
}) {
  return (
    <div className="glass rounded-app p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_auto]">
        <div>
          <input
            className="focus-ring w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
          />
          {search && suggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map((item) => (
                <button className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary" key={item} onClick={() => setSearch(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
        <select className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={filter} onChange={(event) => setFilter(event.target.value)}>
          {['All', 'Completed', 'Pending', 'Important'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 font-bold dark:border-slate-700 dark:bg-slate-900 dark:text-white" value={sort} onChange={(event) => setSort(event.target.value)}>
          {['Date', 'Priority', 'Alphabetical'].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <div className="flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
          <button className={`rounded-xl p-3 ${view === 'grid' ? 'bg-white text-primary shadow dark:bg-slate-800' : 'text-slate-500'}`} onClick={() => setView('grid')} type="button">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button className={`rounded-xl p-3 ${view === 'list' ? 'bg-white text-primary shadow dark:bg-slate-800' : 'text-slate-500'}`} onClick={() => setView('list')} type="button">
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
