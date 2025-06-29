import { api } from '@/lib/api';
import {
  Building,
  BuildingFloor,
  BuildingFloorsResponse,
  BuildingsResponse,
  CreateBuildingDto,
  CreateBuildingFloorDto,
  CreateLotDto,
  CreatePartDto,
  CreatePartFloorDto,
  CreateSiteDto,
  Lot,
  LotsResponse,
  Part,
  PartFloor,
  PartFloorsResponse,
  PartsResponse,
  Site,
  SitesResponse,
  UpdateBuildingDto,
  UpdateBuildingFloorDto,
  UpdateLotDto,
  UpdatePartDto,
  UpdatePartFloorDto,
  UpdateSiteDto,
} from '@/types/site';

// ============ SITE SERVICES ============

export const siteService = {
  // Get all sites with client-side filtering
  async getSites(params: {
    companyId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ sites: Site[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.companyId) {
      searchParams.append('companyId', params.companyId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<SitesResponse>(`/sites?${searchParams}`);
    let sites = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      sites = sites.filter(site =>
        site.name.toLowerCase().includes(searchLower) ||
        site.street.toLowerCase().includes(searchLower) ||
        site.city.toLowerCase().includes(searchLower) ||
        site.reference?.toLowerCase().includes(searchLower)
      );
    }

    return {
      sites,
      total: sites.length,
    };
  },

  async getSite(id: number): Promise<Site> {
    const response = await api.get<Site>(`/sites/${id}`);
    return response.data;
  },

  async createSite(data: CreateSiteDto): Promise<Site> {
    const response = await api.post<Site>('/sites', data);
    return response.data;
  },

  async updateSite(id: number, data: UpdateSiteDto): Promise<Site> {
    const response = await api.patch<Site>(`/sites/${id}`, data);
    return response.data;
  },

  async updateSiteState(id: number): Promise<Site> {
    const response = await api.patch<Site>(`/sites/${id}/update-state`);
    return response.data;
  },
};

// ============ BUILDING SERVICES ============

export const buildingService = {
  async getBuildings(params: {
    siteId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ buildings: Building[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.siteId) {
      searchParams.append('siteId', params.siteId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<BuildingsResponse>(`/buildings?${searchParams}`);
    let buildings = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      buildings = buildings.filter(building =>
        building.name.toLowerCase().includes(searchLower)
      );
    }

    return {
      buildings,
      total: buildings.length,
    };
  },

  async getBuilding(id: number): Promise<Building> {
    const response = await api.get<Building>(`/buildings/${id}`);
    return response.data;
  },

  async createBuilding(data: CreateBuildingDto): Promise<Building> {
    const response = await api.post<Building>('/buildings', data);
    return response.data;
  },

  async updateBuilding(id: number, data: UpdateBuildingDto): Promise<Building> {
    const response = await api.patch<Building>(`/buildings/${id}`, data);
    return response.data;
  },

  async deleteBuilding(id: number): Promise<void> {
    await api.delete(`/buildings/${id}`);
  },
};

// ============ BUILDING FLOOR SERVICES ============

export const buildingFloorService = {
  async getBuildingFloors(params: {
    buildingId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ buildingFloors: BuildingFloor[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.buildingId) {
      searchParams.append('buildingId', params.buildingId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<BuildingFloorsResponse>(`/buildings/floors?${searchParams}`);
    let buildingFloors = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      buildingFloors = buildingFloors.filter(floor =>
        floor.name.toLowerCase().includes(searchLower)
      );
    }

    return {
      buildingFloors,
      total: buildingFloors.length,
    };
  },

  async getBuildingFloor(id: number): Promise<BuildingFloor> {
    const response = await api.get<BuildingFloor>(`/buildings/floors/${id}`);
    return response.data;
  },

  async createBuildingFloor(data: CreateBuildingFloorDto): Promise<BuildingFloor> {
    const response = await api.post<BuildingFloor>('/buildings/floors', data);
    return response.data;
  },

  async updateBuildingFloor(id: number, data: UpdateBuildingFloorDto): Promise<BuildingFloor> {
    const response = await api.patch<BuildingFloor>(`/buildings/floors/${id}`, data);
    return response.data;
  },

  async deleteBuildingFloor(id: number): Promise<void> {
    await api.delete(`/buildings/floors/${id}`);
  },
};

// ============ PART SERVICES ============

export const partService = {
  async getParts(params: {
    buildingId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ parts: Part[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.buildingId) {
      searchParams.append('buildingId', params.buildingId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<PartsResponse>(`/parts?${searchParams}`);
    let parts = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      parts = parts.filter(part =>
        part.name.toLowerCase().includes(searchLower) ||
        part.type.toLowerCase().includes(searchLower)
      );
    }

    return {
      parts,
      total: parts.length,
    };
  },

  async getPart(id: number): Promise<Part> {
    const response = await api.get<Part>(`/parts/${id}`);
    return response.data;
  },

  async createPart(data: CreatePartDto): Promise<Part> {
    const response = await api.post<Part>('/parts', data);
    return response.data;
  },

  async updatePart(id: number, data: UpdatePartDto): Promise<Part> {
    const response = await api.patch<Part>(`/parts/${id}`, data);
    return response.data;
  },

  async deletePart(id: number): Promise<void> {
    await api.delete(`/parts/${id}`);
  },
};

// ============ PART FLOOR SERVICES ============

export const partFloorService = {
  async getPartFloors(params: {
    buildingFloorId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ partFloors: PartFloor[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.buildingFloorId) {
      searchParams.append('buildingFloorId', params.buildingFloorId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<PartFloorsResponse>(`/parts/floors?${searchParams}`);
    let partFloors = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      partFloors = partFloors.filter(floor =>
        floor.name.toLowerCase().includes(searchLower)
      );
    }

    return {
      partFloors,
      total: partFloors.length,
    };
  },

  async getPartFloor(id: number): Promise<PartFloor> {
    const response = await api.get<PartFloor>(`/parts/floors/${id}`);
    return response.data;
  },

  async createPartFloor(data: CreatePartFloorDto): Promise<PartFloor> {
    const response = await api.post<PartFloor>('/parts/floors', data);
    return response.data;
  },

  async updatePartFloor(id: number, data: UpdatePartFloorDto): Promise<PartFloor> {
    const response = await api.patch<PartFloor>(`/parts/floors/${id}`, data);
    return response.data;
  },

  async deletePartFloor(id: number): Promise<void> {
    await api.delete(`/parts/floors/${id}`);
  },
};

// ============ LOT SERVICES ============

export const lotService = {
  async getLots(params: {
    buildingId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ lots: Lot[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');

    if (params.buildingId) {
      searchParams.append('buildingId', params.buildingId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<LotsResponse>(`/lots?${searchParams}`);
    let lots = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      lots = lots.filter(lot =>
        lot.name.toLowerCase().includes(searchLower)
      );
    }

    return {
      lots,
      total: lots.length,
    };
  },

  async getLot(id: number): Promise<Lot> {
    const response = await api.get<Lot>(`/lots/${id}`);
    return response.data;
  },

  async createLot(data: CreateLotDto): Promise<Lot> {
    const response = await api.post<Lot>('/lots', data);
    return response.data;
  },

  async updateLot(id: number, data: UpdateLotDto): Promise<Lot> {
    const response = await api.patch<Lot>(`/lots/${id}`, data);
    return response.data;
  },

  async deleteLot(id: number): Promise<void> {
    await api.delete(`/lots/${id}`);
  },
};

// ============ UTILITY FUNCTIONS ============

// Helper function to filter sites
export const filterSites = (sites: Site[], filters: {
  search?: string;
  includeDeleted?: boolean;
}): Site[] => {
  let filtered = sites;

  if (!filters.includeDeleted) {
    filtered = filtered.filter(site => !site.deletedAt);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(site =>
      site.name.toLowerCase().includes(searchLower) ||
      site.street.toLowerCase().includes(searchLower) ||
      site.city.toLowerCase().includes(searchLower) ||
      site.reference?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// Helper function to get full address
export const getFullAddress = (site: Site): string => {
  return `${site.streetNumber} ${site.street}, ${site.postalCode} ${site.city}`;
}; 