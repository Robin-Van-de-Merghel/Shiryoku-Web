/**
 * Column definitions for the Nmap ports data table
 * 
 * Uses TanStack Table's ColumnDef for type-safe column configuration.
 * Each column is independently sortable and styled.
 */

import { ColumnDef } from "@tanstack/react-table";
import { NmapHostDocument } from "@/api-types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Maps port status to badge color class
 */
function getStatusColor(status?: string): string {
  switch (status) {
    case "up":
      return "bg-green-100 text-green-800";
    case "down":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Status badge component with dynamic coloring based on port state
 */
function StatusBadge({ status }: { status?: string }) {
  return (
    <Badge className={getStatusColor(status)}>
      {status || "Unknown"}
    </Badge>
  );
}

/**
 * Column definitions for NmapHostDocument.
 * Can be reused or extended for different views.
 */
export const hostColumns: ColumnDef<NmapHostDocument>[] = [
  {
    accessorKey: "host",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Host IP
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("host") || "—"}</span>
    ),
  },
  {
    accessorKey: "hostnames",
    header: "Hostnames",
    cell: ({ row }) => (row.getValue("hostnames") as string[])[0] || "—",
  },
  {
    accessorKey: "host_status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("host_status") as string} />
    ),
  },
  {
    accessorKey: "os_name",
    header: "OS",
    cell: ({ row }) => row.getValue("os_name") || "—",
  }
];
