/**
 * Main dashboard page for browsing and filtering Nmap port scan results
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Target, Network, Search as SearchIcon } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { StatCard } from "@/components/stat-card/stat-card";
import { hostColumns } from "@/features/hosts/columns";
import {
  NmapHostDocument,
  SearchParams,
  SearchResult,
  fetchStats,
  searchHosts,
} from "@/api-types";

export function Dashboard() {
  // State Management
  const [hosts, setHosts] = useState<NmapHostDocument[]>([]);
  const [stats, setStats] = useState({
    totalHosts: 0,
    totalScans: 0,
    differentServices: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 10;

  /**
   * Load dashboard statistics on component mount
   */
  useEffect(() => {
    (async () => {
      const data = await fetchStats();
      setStats(data);
    })();
  }, []);

  /**
   * Fetch hosts with applied filters
   * 
   * @param page - Page number (1-indexed)
   * @param query - Search query string
   */
  const fetchHosts = async (page: number, query: string = "") => {
    setIsLoading(true);
    try {
      // Build SearchParams matching the backend structure
      // Only include necessary fields: page, per_page, sort
      // Search filter is optional - only add if query exists
      const searchParams: SearchParams = {
        page: page - 1, // Convert to 0-indexed for API
        per_page: pageSize,
        search: []
      };

      // Only add search filter if query is not empty
      if (query) {
        searchParams.search = [
          {
            parameter: "host",
            operator: "eq",
            value: query,
          } as any,
        ];
      }

      const result: SearchResult<NmapHostDocument> = await searchHosts(
        searchParams
      );
      setHosts(result.results);
      setTotalCount(result.total);
    } catch (error) {
      console.error("Failed to fetch hosts:", error);
      // TODO: Display toast error notification
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initial data load on mount
   */
  useEffect(() => {
    fetchHosts(1, searchQuery);
  }, []);

  /**
   * Handle search form submission
   */
  const handleSearch = () => {
    setCurrentPage(1);
    fetchHosts(1, searchQuery);
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchHosts(page, searchQuery);
  };

  /**
   * Handle sort direction change
   */
  const handleSortChange = (direction: "newest" | "oldest") => {
    setSortBy(direction);
    setCurrentPage(1);
    fetchHosts(1, searchQuery);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Hosts"
          value={stats.totalHosts.toLocaleString()}
          icon={<Users />}
        />
        <StatCard
          title="Total Scans"
          value={stats.totalScans.toLocaleString()}
          icon={<Target />}
        />
        <StatCard
          title="Different Services"
          value={stats.differentServices}
          icon={<Network />}
        />
      </div>

      {/* Hosts Results Section */}
      <Card className="dark:bg-slate-900 dark:border-slate-700">
        <CardHeader>
          {/* Section header with subtitle */}
          <div className="flex items-center justify-between">
            <CardTitle className="dark:text-white">Last scanned hosts</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active scanning</p>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 flex gap-2">
              {/* Search input */}
              <Input
                placeholder="Search by host ip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="flex-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              />
              {/* Search submit button */}
              <Button
                onClick={handleSearch}
                variant="outline"
                size="icon"
                disabled={isLoading}
                className="dark:border-slate-600 dark:hover:bg-slate-800"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
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
          {/* Data table with pagination and sorting */}
          <DataTable
            columns={hostColumns}
            data={hosts}
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
