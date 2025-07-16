// Types pour les réponses paginées de l'API

export type SortOrder = 'asc' | 'desc';

export type FilterOperator =
  | 'between'
  | 'contains'
  | 'is'
  | 'not'
  | 'equals'
  | 'startsWith'
  | 'endsWith'
  | 'isAnyOf'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'after'
  | 'onOrAfter'
  | 'before'
  | 'onOrBefore';

export interface PaginatedRequestDto {
  offset?: number; // default: 0, Retrieve a subset of records
  limit?: number; // default: 20, Max results to fetch
  sortOrder?: SortOrder; // default: desc, Sorting order
  sortField?: string; // Sorting field, example: createdAt
  search?: string; // Search a value in multiple columns, example: John
  filterField?: string; // Field to filter on, example: firstName
  filterOp?: FilterOperator; // Filter operator
  filter?: string; // Filter value, example: active
  includeDeleted?: boolean; // Include soft deleted records
}

export interface PaginatedResponseDto<T = any> {
  currentResults: number; // Total of current results
  totalResults: number; // Total results
  results: T[]; // Results array
}

// Types d'utilité pour les filtres communs
export interface BaseFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface StatusFilters extends BaseFilters {
  status?: string;
  isActive?: boolean;
  includeDeleted?: boolean;
}
