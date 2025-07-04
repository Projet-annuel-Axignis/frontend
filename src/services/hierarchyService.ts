import { Company } from '@/types/company';
import {
  Building,
  BuildingFloor,
  BuildingWithFloors,
  Lot,
  Part,
  PartFloor,
  Site,
  SiteWithBuildings
} from '@/types/site';
import companyService from './companyService';
import {
  buildingFloorService,
  buildingService,
  lotService,
  partFloorService,
  partService,
  siteService
} from './siteService';

export interface HierarchicalData {
  companies: Company[];
  sites: SiteWithBuildings[];
  buildings: BuildingWithFloors[];
  buildingFloors: BuildingFloor[];
  parts: Part[];
  partFloors: PartFloor[];
  lots: Lot[];
}

export interface CompanyHierarchy extends Company {
  sites: SiteHierarchy[];
}

export interface SiteHierarchy extends Site {
  buildings: BuildingHierarchy[];
}

export interface BuildingHierarchy extends Building {
  floors: BuildingFloor[];
  parts: PartHierarchy[];
  lots: Lot[];
}

export interface PartHierarchy extends Part {
  floors: PartFloor[];
}

/**
 * Service pour gérer la hiérarchie complète des données
 */
export const hierarchyService = {
  /**
   * Charge toutes les données nécessaires pour la navigation hiérarchique
   */
  async loadHierarchicalData(params: {
    companyId?: number;
    siteId?: number;
    includeDeleted?: boolean;
  } = {}): Promise<{ data: HierarchicalData; includeDeleted: boolean }> {
    try {
      // Charger les entreprises
      const companiesResponse = await companyService.getCompanies({
        includeDeleted: params.includeDeleted,
      });
      const companies = companiesResponse.companies;

      // Charger les sites
      const sitesResponse = await siteService.getSites({
        companyId: params.companyId,
        includeDeleted: params.includeDeleted,
      });
      const sites = sitesResponse.sites;

      // Charger les bâtiments pour tous les sites
      const buildingsPromises = sites.map(site =>
        buildingService.getBuildings({
          siteId: site.id,
          includeDeleted: params.includeDeleted,
        })
      );
      const buildingsResponses = await Promise.all(buildingsPromises);
      const buildings = buildingsResponses.flatMap(response => response.buildings);

      // Charger les étages de bâtiment pour tous les bâtiments
      const buildingFloorsPromises = buildings.map(building =>
        buildingFloorService.getBuildingFloors({
          buildingId: building.id,
          includeDeleted: params.includeDeleted,
        })
      );
      const buildingFloorsResponses = await Promise.all(buildingFloorsPromises);
      const buildingFloors = buildingFloorsResponses.flatMap(response => response.buildingFloors);

      // Charger les parties pour tous les bâtiments
      const partsPromises = buildings.map(building =>
        partService.getParts({
          buildingId: building.id,
          includeDeleted: params.includeDeleted,
        })
      );
      const partsResponses = await Promise.all(partsPromises);
      const parts = partsResponses.flatMap(response => response.parts);

      // Charger les étages de partie pour tous les étages de bâtiment
      const partFloorsPromises = buildingFloors.map(buildingFloor =>
        partFloorService.getPartFloors({
          buildingFloorId: buildingFloor.id,
          includeDeleted: params.includeDeleted,
        })
      );
      const partFloorsResponses = await Promise.all(partFloorsPromises);
      const partFloors = partFloorsResponses.flatMap(response => response.partFloors);

      // Charger les lots pour tous les bâtiments
      const lotsPromises = buildings.map(building =>
        lotService.getLots({
          buildingId: building.id,
          includeDeleted: params.includeDeleted,
        })
      );
      const lotsResponses = await Promise.all(lotsPromises);
      const lots = lotsResponses.flatMap(response => response.lots);

      // Structurer les sites avec leurs bâtiments
      const sitesWithBuildings: SiteWithBuildings[] = sites.map(site => ({
        ...site,
        buildings: buildings.filter(building => building.site?.id === site.id),
      }));

      // Structurer les bâtiments avec leurs relations
      const buildingsWithFloors: BuildingWithFloors[] = buildings.map(building => ({
        ...building,
        buildingFloors: buildingFloors.filter(floor => floor.building.id === building.id),
        parts: parts.filter(part => part.building?.id === building.id),
      }));

      return {
        data: {
          companies,
          sites: sitesWithBuildings,
          buildings: buildingsWithFloors,
          buildingFloors,
          parts,
          partFloors,
          lots,
        },
        includeDeleted: params.includeDeleted || false,
      };
    } catch (error) {
      console.error('Erreur lors du chargement des données hiérarchiques:', error);
      throw error;
    }
  },

  /**
 * Structure les données en hiérarchie complète avec toutes les relations
 */
  buildCompleteHierarchy(data: HierarchicalData, includeDeleted = false): CompanyHierarchy[] {
    // Fonction helper pour vérifier si un élément est supprimé
    const isDeleted = (entity: any) => {
      return entity && entity.deletedAt !== null && entity.deletedAt !== undefined;
    };

    return data.companies
      .filter(company => includeDeleted || !isDeleted(company))
      .map(company => {
        const companySites = data.sites
          .filter(site => site.companyId === company.id)
          .filter(site => includeDeleted || !isDeleted(site));

        return {
          ...company,
          sites: companySites.map(site => {
            const siteBuildings = data.buildings
              .filter(building => building.site?.id === site.id)
              .filter(building => includeDeleted || !isDeleted(building));

            return {
              ...site,
              buildings: siteBuildings.map(building => {
                const buildingFloors = data.buildingFloors
                  .filter(floor => floor.building.id === building.id)
                  .filter(floor => includeDeleted || !isDeleted(floor));

                const buildingParts = data.parts
                  .filter(part => part.building?.id === building.id)
                  .filter(part => includeDeleted || !isDeleted(part));

                const buildingLots = data.lots
                  .filter(lot => lot.buildingId === building.id)
                  .filter(lot => includeDeleted || !isDeleted(lot));

                return {
                  ...building,
                  floors: buildingFloors,
                  parts: buildingParts.map(part => {
                    // Associer les partFloors à cette part via la relation buildingFloor
                    const partFloors = data.partFloors
                      .filter(pf => buildingFloors.some(bf => bf.id === pf.buildingFloor.id))
                      .filter(pf => includeDeleted || !isDeleted(pf));

                    return {
                      ...part,
                      floors: partFloors,
                    };
                  }),
                  lots: buildingLots,
                };
              }),
            };
          }),
        };
      });
  },

  /**
   * Charge les données hiérarchiques pour une entreprise spécifique
   */
  async loadCompanyHierarchy(companyId: number, includeDeleted = false): Promise<CompanyHierarchy | null> {
    try {
      const result = await this.loadHierarchicalData({ companyId, includeDeleted });
      const hierarchy = this.buildCompleteHierarchy(result.data, result.includeDeleted);
      return hierarchy.find(company => company.id === companyId) || null;
    } catch (error) {
      console.error(`Erreur lors du chargement de la hiérarchie pour l'entreprise ${companyId}:`, error);
      throw error;
    }
  },

  /**
   * Charge les données hiérarchiques pour un site spécifique
   */
  async loadSiteHierarchy(siteId: number, includeDeleted = false): Promise<SiteHierarchy | null> {
    try {
      const result = await this.loadHierarchicalData({ siteId, includeDeleted });
      const hierarchy = this.buildCompleteHierarchy(result.data, result.includeDeleted);

      for (const company of hierarchy) {
        const site = company.sites.find(s => s.id === siteId);
        if (site) {
          return site;
        }
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors du chargement de la hiérarchie pour le site ${siteId}:`, error);
      throw error;
    }
  },

  /**
   * Recherche dans la hiérarchie avec filtrage
   */
  searchInHierarchy(
    hierarchy: CompanyHierarchy[],
    searchTerm: string
  ): CompanyHierarchy[] {
    if (!searchTerm.trim()) {
      return hierarchy;
    }

    const searchLower = searchTerm.toLowerCase();

    return hierarchy.map(company => {
      const filteredSites = company.sites.map(site => {

        const filteredBuildings = site.buildings.filter(building => {
          const matchingBuilding = building.name.toLowerCase().includes(searchLower);
          const matchingParts = building.parts.some(part =>
            part.name.toLowerCase().includes(searchLower)
          );
          const matchingFloors = building.floors.some(floor =>
            floor.name.toLowerCase().includes(searchLower)
          );
          const matchingLots = building.lots.some(lot =>
            lot.name.toLowerCase().includes(searchLower)
          );

          return matchingBuilding || matchingParts || matchingFloors || matchingLots;
        });

        return {
          ...site,
          buildings: filteredBuildings,
        };
      }).filter(site => {
        const siteMatches = site.name.toLowerCase().includes(searchLower) ||
          site.street.toLowerCase().includes(searchLower) ||
          site.city.toLowerCase().includes(searchLower);
        return siteMatches || site.buildings.length > 0;
      });

      return {
        ...company,
        sites: filteredSites,
      };
    }).filter(company => {
      const companyMatches = company.name.toLowerCase().includes(searchLower);
      return companyMatches || company.sites.length > 0;
    });
  },

  /**
   * Obtient les statistiques de la hiérarchie
   */
  getHierarchyStats(hierarchy: CompanyHierarchy[]): {
    companies: number;
    sites: number;
    buildings: number;
    parts: number;
    floors: number;
    lots: number;
  } {
    let sites = 0;
    let buildings = 0;
    let parts = 0;
    let floors = 0;
    let lots = 0;

    hierarchy.forEach(company => {
      sites += company.sites.length;
      company.sites.forEach(site => {
        buildings += site.buildings.length;
        site.buildings.forEach(building => {
          parts += building.parts.length;
          floors += building.floors.length;
          lots += building.lots.length;
          building.parts.forEach(part => {
            floors += part.floors.length;
          });
        });
      });
    });

    return {
      companies: hierarchy.length,
      sites,
      buildings,
      parts,
      floors,
      lots,
    };
  },
}; 