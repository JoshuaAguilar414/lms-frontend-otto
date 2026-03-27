'use client';

interface SearchBarProps {
  /** When true, always visible (e.g. inside mobile menu). Default: desktop-only. */
  inline?: boolean;
  /** Passed to `data-project-search` (e.g. /de). */
  projectSearch?: string;
}

/**
 * searchBoxContainer → searchBoxElement → input.searchTerm + #searchSubmit (no form wrapper).
 * Search icon 16×16px; bar width target 188px total (compact row).
 */
export function SearchBar({ inline, projectSearch = '' }: SearchBarProps) {
  return (
    <div
      className={`searchBoxContainer font-sans w-[188px] max-w-full shrink-0 ${inline ? 'mx-auto' : ''}`}
    >
      <div
        className="searchBoxElement flex items-end gap-1.5 border-b border-otto-burgundy"
        role="search"
      >
        <span className="sr-only">Search</span>
        <img
          src="/search.svg"
          alt=""
          width={16}
          height={16}
          className="h-4 w-4 shrink-0 object-contain mb-1.5"
          aria-hidden
        />
        <input
          type="text"
          id="searchTermGlobal"
          name="searchTerm"
          className="searchTerm min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm text-otto-burgundy placeholder:text-otto-burgundy/45 focus:outline-none focus:ring-0"
          placeholder=""
          data-project-search={projectSearch}
          data-suggest-path=""
          defaultValue=""
        />
        
      </div>
    </div>
  );
}
