import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { DashboardGrid } from './DashboardGrid';

interface DataListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  gridCols?: 1 | 2 | 3 | 4;
  layout?: 'grid' | 'list';
  loadingRows?: number;
  // Standard list pagination properties
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataList<T>({
  items,
  renderItem,
  isLoading = false,
  emptyTitle = 'No items found',
  emptyDescription = 'There are no items matching this criteria.',
  emptyIcon = HelpCircle,
  emptyAction,
  gridCols = 3,
  layout = 'grid',
  loadingRows = 6,
  currentPage = 1,
  pageCount = 1,
  onPageChange,
}: DataListProps<T>) {
  if (isLoading) {
    if (layout === 'list') {
      return <LoadingState variant="list" rows={loadingRows} />;
    }
    return (
      <DashboardGrid cols={gridCols}>
        {Array.from({ length: loadingRows }).map((_, idx) => (
          <LoadingState key={idx} variant="card" />
        ))}
      </DashboardGrid>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-6">
      {layout === 'grid' ? (
        <DashboardGrid cols={gridCols}>
          {items.map((item, idx) => (
            <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
          ))}
        </DashboardGrid>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <React.Fragment key={idx}>{renderItem(item)}</React.Fragment>
          ))}
        </div>
      )}

      {/* Reusable Pagination footer */}
      {pageCount > 1 && onPageChange && (
        <div className="flex items-center justify-end space-x-2 py-4 border-t border-white/5 flex-wrap gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-foreground hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= pageCount}
            className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-foreground hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
