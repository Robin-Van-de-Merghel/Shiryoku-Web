/**
 * Column definitions for the Nmap ports data table
 * 
 * Uses TanStack Table's ColumnDef for type-safe column configuration.
 * Each column is independently sortable and styled.
 */

import { ColumnDef } from "@tanstack/react-table";
import { NmapPortDocument, PortStatus } from "@/api-types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Maps port status to badge color class
 */
function getStatusColor(status?: PortStatus): string {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-red-100 text-red-800";
    case "filtered":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Status badge component with dynamic coloring based on port state
 */
function StatusBadge({ status }: { status?: PortStatus }) {
  return (
    <Badge className={getStatusColor(status)}>
      {status || "Unknown"}
    </Badge>
  );
}

/**
 * Column definitions for NmapPortDocument.
 * Can be reused or extended for different views.
 */
export const portColumns: ColumnDef<NmapPortDocument>[] = [
  {
    accessorKey: "service_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Service name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("service_name") || "—"}</span>
    ),
  },
  {
    accessorKey: "service_product",
    header: "Product",
    cell: ({ row }) => row.getValue("service_product") || "—",
  },
  {
    accessorKey: "port",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Port
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const port = row.getValue("port") as number;
      const protocol = row.original.protocol || "tcp";
      return (
        <code className="px-2 py-1 bg-gray-100 rounded text-sm">
          {port}/{protocol}
        </code>
      );
    },
  },
  {
    accessorKey: "service_version",
    header: "Version",
    cell: ({ row }) => row.getValue("service_version") || "—",
  },
  {
    accessorKey: "port_state",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.getValue("port_state") as PortStatus} />
    ),
  },
];
