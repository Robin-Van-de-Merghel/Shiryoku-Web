import { ColumnDef } from "@tanstack/react-table";
import { DashboardWidgetScan } from "@/api-types";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";


export const dashboardWidgetColumns: ColumnDef<DashboardWidgetScan>[] = [
  {
    accessorKey: "host",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Host IP
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("host") || "—"}</span>,
  },
  {
    accessorKey: "hostnames",
    header: "Hostnames",
    cell: ({ row }) => {
      const hostnames = row.getValue("hostnames") as string[];
      if (!hostnames?.length) return "—";
      return (
        <div className="flex flex-wrap gap-1">
          {hostnames.map((name) => (
            <Badge key={name} className="bg-blue-100 text-blue-800">
              {name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "ports",
    header: "Ports",
    cell: ({ row }) => {
      const ports = row.getValue("ports") as number[];
      if (!ports?.length) return "—";
      return (
        <div className="flex flex-wrap gap-1">
          {ports.map((p) => (
            <Badge key={p} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {p}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "scan_start",
    header: "Scan Time",
    cell: ({ row }) => {
      const raw = row.getValue("scan_start") as string | undefined;
      if (!raw) return <Badge>—</Badge>;

      const date = new Date(raw);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

      let relativeTime = "";
      if (diff < 60) relativeTime = `${diff} sec${diff !== 1 ? "s" : ""} ago`;
      else if (diff < 3600) relativeTime = `${Math.floor(diff / 60)} min${Math.floor(diff / 60) !== 1 ? "s" : ""} ago`;
      else if (diff < 86400) relativeTime = `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) !== 1 ? "s" : ""} ago`;
      else relativeTime = `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) !== 1 ? "s" : ""} ago`;

      // Determine badge color
      let colorClass = "bg-red-100 text-red-800"; // default: older than 1 day
      if (diff < 3600) colorClass = "bg-green-100 text-green-800";      // less than 1h
      else if (diff < 86400) colorClass = "bg-yellow-100 text-yellow-800"; // less than 1 day

      return (
        <Badge className={colorClass} title={date.toLocaleString()}>
          {relativeTime}
        </Badge>
      );
    },
  }
];