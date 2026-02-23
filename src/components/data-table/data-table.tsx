/**
 * Generic data table component powered by TanStack Table
 * 
 * Supports:
 * - Client-side sorting
 * - Server-side pagination (manual pagination mode)
 * - Custom column rendering
 * - Loading states
 * - Flexible column definitions via ColumnDef
 */

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DataTableProps<TData> {
  /** Column definitions */
  columns: ColumnDef<TData>[];
  /** Row data to display */
  data: TData[];
  /** Total number of results (for pagination info) */
  totalCount?: number;
  /** Loading indicator */
  isLoading?: boolean;
  /** Callback when user navigates to a different page */
  onPageChange?: (page: number) => void;
  /** Callback when sort order changes */
  onSortChange?: (sorting: SortingState) => void;
  /** Current page (1-indexed) */
  currentPage?: number;
  /** Results per page */
  pageSize?: number;
}

export function DataTable<TData>({
  columns,
  data,
  totalCount = data.length,
  isLoading = false,
  onPageChange,
  onSortChange,
  currentPage = 1,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);
      onSortChange?.(newSorting);
    },
    // Enable manual pagination mode (server-side pagination)
    manualPagination: true,
    rowCount: totalCount,
  });

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-gray-50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        {/* Result count info */}
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>

        {/* Page navigation buttons */}
        <div className="flex items-center gap-2">
          {/* Previous page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={!hasPreviousPage || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page number buttons */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </Button>
              );
            })}
            {totalPages > 5 && (
              <span className="px-2 py-1 text-sm">...</span>
            )}
          </div>

          {/* Next page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={!hasNextPage || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
