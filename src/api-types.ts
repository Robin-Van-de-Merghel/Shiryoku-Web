/**
 * API types and services for Nmap port scanning module
 * 
 * Defines interfaces matching the backend SearchParams structure
 * and provides type-safe fetch methods for API communication.
 */

// Protocol types supported by Nmap
export type Protocol = "tcp" | "udp" | "sctp";

// Possible port states returned by Nmap
export type PortStatus =
  | "open"
  | "closed"
  | "filtered"
  | "unfiltered"
  | "open|filtered"
  | "closed|filtered";

/**
 * Represents a single port result from an Nmap scan.
 * Stored separately from host/scan metadata for storage optimization.
 */
export interface NmapPortDocument {
  scan_id?: string;
  host_id?: string;
  port: number;
  protocol?: Protocol;
  port_state?: PortStatus;
  service_name?: string;
  service_product?: string;
  service_version?: string;
  service_extra_info?: string;
  service_tunnel?: string;
  scripts?: NmapScriptResult[];
}

/**
 * Represents a single host result from an Nmap scan.
 */
export interface NmapHostDocument {
  host_id?: string;
  host?: string;
  comment?: string;
  addresses?: string[];
  hostnames?: string[];
  host_status?: string;
  os_name?: string;
  os_accuracy?: number;
}

export interface NmapScriptResult {
  id: string;
  output: string;
}

// Search operators for filtering single values
export type ScalarOperator =
  | "eq"
  | "neq"
  | "gt"
  | "lt"
  | "like"
  | "not like"
  | "regex";

// Search operators for filtering multiple values
export type VectorOperator = "in" | "not in";

// Sort direction enum
export type SortDirection = "asc" | "desc";

/**
 * Defines sorting for a single field
 */
export interface SortSpec {
  parameter: string;
  direction: SortDirection;
}

/**
 * Single-value search filter
 */
export interface ScalarSearchSpec {
  parameter: string;
  operator: ScalarOperator;
  value: any;
}

/**
 * Multi-value search filter
 */
export interface VectorSearchSpec {
  parameter: string;
  operator: VectorOperator;
  values: any[];
}

/**
 * Complete search request parameters.
 * Supports flexible filtering, sorting, and pagination.
 */
export interface SearchParams {
  search?: (ScalarSearchSpec | VectorSearchSpec)[];
  sort?: SortSpec[];
  page: number;
  per_page: number;
}

/**
 * Generic response wrapper for paginated search results
 */
export interface SearchResult<T> {
  total: number;
  results: T[];
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Build HTTP headers for API requests.
 * TODO: Integrate authentication token when auth system is implemented.
 */
function getHeaders() {
  return {
    "Content-Type": "application/json",
    // Authorization header will be added here
  };
}

/**
 * Search for Nmap port documents with filtering, sorting, and pagination.
 * 
 * @param params - Search parameters including filters, sort, and pagination
 * @returns Promise resolving to paginated search results
 * @throws Error if the API request fails
 */
export async function searchPorts(
  params: SearchParams
): Promise<SearchResult<NmapPortDocument>> {
  const response = await fetch(`${API_BASE}/modules/nmap/search/ports`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Search for Nmap hosts documents with filtering, sorting, and pagination.
 * 
 * @param params - Search parameters including filters, sort, and pagination
 * @returns Promise resolving to paginated search results
 * @throws Error if the API request fails
 */
export async function searchHosts(
  params: SearchParams
): Promise<SearchResult<NmapHostDocument>> {
  const response = await fetch(`${API_BASE}/modules/nmap/search/hosts`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(
      `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch dashboard statistics.
 * TODO: Replace with actual API endpoint once available.
 * Currently returns mock data for UI development.
 */
export async function fetchStats() {
  return {
    totalHosts: 5423,
    totalScans: 1893,
    differentServices: 189,
  };
}
