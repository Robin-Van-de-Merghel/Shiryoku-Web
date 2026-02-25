import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Users, Target, Network } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { StatCard } from "@/components/stat-card/stat-card";
import { dashboardWidgetColumns } from "@/features/dashboard-widget/columns";
import {
  DashboardWidgetScan,
  SearchParams,
  SearchResult,
  fetchStats,
  searchDashboardWidget,
} from "@/api-types";

export function Dashboard() {
  const [scans, setScans] = useState<DashboardWidgetScan[]>([]);
  const [filteredScans, setFilteredScans] = useState<DashboardWidgetScan[]>([]);
  const [stats, setStats] = useState({ totalHosts: 0, totalScans: 0, differentServices: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [ignoreNoOpenPorts, setIgnoreNoOpenPorts] = useState(true);

  const pageSize = 10;

  useEffect(() => {
    (async () => {
      const data = await fetchStats();
      setStats(data);
    })();
  }, []);

  useEffect(() => {
    if (ignoreNoOpenPorts) {
      setFilteredScans(scans.filter((s) => s.ports && s.ports.length > 0));
    } else {
      setFilteredScans(scans);
    }
  }, [scans, ignoreNoOpenPorts]);

  const fetchDashboardWidget = async (page: number) => {
    setIsLoading(true);
    try {
      const searchParams: SearchParams = {
        page,
        per_page: pageSize,
        sort: [{ parameter: "scan_start", direction: sortBy === "newest" ? "desc" : "asc" }],
        search: [],
      };

      if (ignoreNoOpenPorts) {
        searchParams?.search?.push({ parameter: "port_number", operator: "gt", value: 0 });
      }

      const result: SearchResult<DashboardWidgetScan> = await searchDashboardWidget(searchParams);

      // **Map PGPorts -> ports**
      const mapped = result.results.map((r) => ({
        ...r,
        ports: r.ports || [],
      }));

      setScans(mapped);
      setTotalCount(result.total);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardWidget(1);
  }, [sortBy, ignoreNoOpenPorts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchDashboardWidget(page);
  };

  const handleSortChange = (direction: "newest" | "oldest") => {
    setSortBy(direction);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Hosts" value={stats.totalHosts.toLocaleString()} icon={<Users />} />
        <StatCard title="Total Scans" value={stats.totalScans.toLocaleString()} icon={<Target />} />
        <StatCard title="Different Services" value={stats.differentServices.toLocaleString()} icon={<Network />} />
      </div>

      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">Last scanned hosts</CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={ignoreNoOpenPorts ? "default" : "outline"}
              onClick={() => setIgnoreNoOpenPorts(!ignoreNoOpenPorts)}
              className={ignoreNoOpenPorts ? "bg-red-600 hover:bg-red-700 text-white" : "text-gray-700 dark:text-gray-300"}
            >
              Ignore devices with no open port
            </Button>

            <Select value={sortBy} onValueChange={(v) => handleSortChange(v as "newest" | "oldest")}>
              <SelectTrigger className="w-40 dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={dashboardWidgetColumns}
            data={filteredScans}
            totalCount={totalCount}
            isLoading={isLoading}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}