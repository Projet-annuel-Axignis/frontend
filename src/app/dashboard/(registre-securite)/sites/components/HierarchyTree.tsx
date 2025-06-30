'use client';

import {
  BuildingHierarchy,
  CompanyHierarchy,
  hierarchyService,
  PartHierarchy,
  SiteHierarchy
} from '@/services/hierarchyService';
import { Company } from '@/types/company';
import { Building, BuildingFloor, Lot, Part, PartFloor, Site } from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Business as BusinessIcon,
  ChevronRight as ChevronRightIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Layers as FloorIcon,
  LocationOn as LocationIcon,
  Inventory as LotIcon,
  ViewModule as PartIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface HierarchyNode {
  id: string;
  type: 'company' | 'site' | 'building' | 'part' | 'building-floor' | 'part-floor' | 'lot';
  name: string;
  data: CompanyHierarchy | SiteHierarchy | BuildingHierarchy | PartHierarchy | BuildingFloor | PartFloor | Lot;
  children: HierarchyNode[];
  parent?: HierarchyNode;
  level: number;
}

interface HierarchyTreeProps {
  onSelectCompany: (company: Company | null) => void;
  onSelectSite: (site: Site | null) => void;
  onSelectBuilding: (building: Building | null) => void;
  onSelectPart: (part: Part | null) => void;
  onSelectFloor: (floor: BuildingFloor | PartFloor | null) => void;
  onSelectLot: (lot: Lot | null) => void;
  onAddEntity: (type: string, parent?: any) => void;
  onEditEntity: (type: string, entity: any) => void;
  onDeleteEntity: (type: string, entity: any) => void;
  includeDeleted?: boolean;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  onSelectCompany,
  onSelectSite,
  onSelectBuilding,
  onSelectPart,
  onSelectFloor,
  onSelectLot,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
  includeDeleted = false,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hierarchyData, setHierarchyData] = useState<CompanyHierarchy[]>([]);
  const [filteredHierarchy, setFilteredHierarchy] = useState<CompanyHierarchy[]>([]);
  const [hierarchyNodes, setHierarchyNodes] = useState<HierarchyNode[]>([]);
  const [stats, setStats] = useState({
    companies: 0,
    sites: 0,
    buildings: 0,
    parts: 0,
    floors: 0,
    lots: 0,
  });

  // Load hierarchy data
  useEffect(() => {
    loadHierarchyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted]);

  // Filter data when search term changes
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = hierarchyService.searchInHierarchy(hierarchyData, searchTerm);
      setFilteredHierarchy(filtered);
    } else {
      setFilteredHierarchy(hierarchyData);
    }
  }, [searchTerm, hierarchyData]);

  // Build tree nodes when filtered data changes
  useEffect(() => {
    const nodes = buildHierarchyNodes();
    setHierarchyNodes(nodes);
    setStats(hierarchyService.getHierarchyStats(filteredHierarchy));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredHierarchy]);

  const loadHierarchyData = async () => {
    try {
      setLoading(true);
      const data = await hierarchyService.loadHierarchicalData({ includeDeleted });
      const hierarchy = hierarchyService.buildCompleteHierarchy(data);
      setHierarchyData(hierarchy);
    } catch (error) {
      console.error('Erreur lors du chargement de la hiérarchie:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildHierarchyNodes = (): HierarchyNode[] => {
    return filteredHierarchy.map(company => {
      const companyNode: HierarchyNode = {
        id: `company-${company.id}`,
        type: 'company',
        name: company.name,
        data: company,
        children: [],
        level: 0,
      };

      companyNode.children = company.sites.map(site => {
        const siteNode: HierarchyNode = {
          id: `site-${site.id}`,
          type: 'site',
          name: site.name,
          data: site,
          children: [],
          parent: companyNode,
          level: 1,
        };

        siteNode.children = site.buildings.map(building => {
          const buildingNode: HierarchyNode = {
            id: `building-${building.id}`,
            type: 'building',
            name: building.name,
            data: building,
            children: [],
            parent: siteNode,
            level: 2,
          };

          // Add building floors
          building.floors.forEach(floor => {
            const floorNode: HierarchyNode = {
              id: `building-floor-${floor.id}`,
              type: 'building-floor',
              name: floor.name,
              data: floor,
              children: [],
              parent: buildingNode,
              level: 3,
            };
            buildingNode.children.push(floorNode);
          });

          // Add parts
          building.parts.forEach(part => {
            const partNode: HierarchyNode = {
              id: `part-${part.id}`,
              type: 'part',
              name: part.name,
              data: part,
              children: [],
              parent: buildingNode,
              level: 3,
            };

            // Add part floors
            part.floors.forEach(partFloor => {
              const partFloorNode: HierarchyNode = {
                id: `part-floor-${partFloor.id}`,
                type: 'part-floor',
                name: partFloor.name,
                data: partFloor,
                children: [],
                parent: partNode,
                level: 4,
              };
              partNode.children.push(partFloorNode);
            });

            buildingNode.children.push(partNode);
          });

          // Add lots
          building.lots.forEach(lot => {
            const lotNode: HierarchyNode = {
              id: `lot-${lot.id}`,
              type: 'lot',
              name: lot.name,
              data: lot,
              children: [],
              parent: buildingNode,
              level: 3,
            };
            buildingNode.children.push(lotNode);
          });

          return buildingNode;
        });

        return siteNode;
      });

      return companyNode;
    });
  };

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const allNodeIds = new Set<string>();
    const collectNodeIds = (nodes: HierarchyNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allNodeIds.add(node.id);
          collectNodeIds(node.children);
        }
      });
    };
    collectNodeIds(hierarchyNodes);
    setExpandedNodes(allNodeIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'company': return <BusinessIcon />;
      case 'site': return <LocationIcon />;
      case 'building': return <BuildingIcon />;
      case 'part': return <PartIcon />;
      case 'building-floor': return <FloorIcon />;
      case 'part-floor': return <FloorIcon />;
      case 'lot': return <LotIcon />;
      default: return <BusinessIcon />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'company': return theme.palette.primary.main;
      case 'site': return theme.palette.secondary.main;
      case 'building': return theme.palette.info.main;
      case 'part': return theme.palette.warning.main;
      case 'building-floor': return theme.palette.success.main;
      case 'part-floor': return theme.palette.success.dark;
      case 'lot': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const handleNodeClick = (node: HierarchyNode) => {
    switch (node.type) {
      case 'company':
        onSelectCompany(node.data as CompanyHierarchy);
        break;
      case 'site':
        onSelectSite(node.data as SiteHierarchy);
        break;
      case 'building':
        onSelectBuilding(node.data as BuildingHierarchy);
        break;
      case 'part':
        onSelectPart(node.data as PartHierarchy);
        break;
      case 'building-floor':
      case 'part-floor':
        onSelectFloor(node.data as BuildingFloor | PartFloor);
        break;
      case 'lot':
        onSelectLot(node.data as Lot);
        break;
    }
  };

  const renderNode = (node: HierarchyNode): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const nodeColor = getNodeColor(node.type);

    return (
      <Box key={node.id} sx={{ mb: 0.5 }}>
        <Card
          sx={{
            ml: node.level * 2,
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            borderLeft: `4px solid ${nodeColor}`,
            '&:hover': {
              backgroundColor: alpha(nodeColor, 0.1),
            },
          }}
          onClick={() => handleNodeClick(node)}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.id);
              }}
              sx={{ p: 0.5 }}
            >
              {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          ) : (
            <Box sx={{ width: 24, height: 24 }} />
          )}

          {/* Node Icon */}
          <Box sx={{ color: nodeColor, display: 'flex', alignItems: 'center' }}>
            {getNodeIcon(node.type)}
          </Box>

          {/* Node Name */}
          <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
            {node.name}
          </Typography>

          {/* Node Type Chip */}
          <Chip
            size="small"
            label={node.type.replace('-', ' ')}
            sx={{
              backgroundColor: alpha(nodeColor, 0.1),
              color: nodeColor,
              fontSize: '0.7rem',
              height: '20px',
            }}
          />

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Ajouter">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddEntity(node.type, node.data);
                }}
                sx={{ p: 0.25 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditEntity(node.type, node.data);
                }}
                sx={{ p: 0.25 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEntity(node.type, node.data);
                }}
                sx={{ p: 0.25 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Card>

        {/* Children */}
        {hasChildren && (
          <Collapse in={isExpanded}>
            <Box>
              {node.children.map(child => renderNode(child))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Card sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Chargement de la hiérarchie...</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon />
          Navigation Hiérarchique
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => onAddEntity('company')}
        >
          Nouvelle Entreprise
        </Button>
      </Box>

      {/* Search and Controls */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher dans la hiérarchie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1 }}
        />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" onClick={expandAll}>
              Tout Développer
            </Button>
            <Button size="small" onClick={collapseAll}>
              Tout Réduire
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            <Chip size="small" label={`${stats.companies} entreprises`} color="primary" />
            <Chip size="small" label={`${stats.sites} sites`} color="secondary" />
            <Chip size="small" label={`${stats.buildings} bâtiments`} color="info" />
          </Box>
        </Box>
      </Box>

      {/* Tree Content */}
      {hierarchyNodes.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary',
          }}
        >
          <BusinessIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1" align="center">
            {searchTerm ? 'Aucun résultat trouvé' : 'Aucune entreprise trouvée'}
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez par créer une entreprise'}
          </Typography>
        </Box>
      ) : (
        <Box>
          {hierarchyNodes.map(node => renderNode(node))}
        </Box>
      )}
    </Card>
  );
};

export default HierarchyTree; 