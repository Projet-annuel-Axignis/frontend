'use client';

import { Company } from '@/types/company';
import {
  Building,
  BuildingFloor,
  Lot,
  Part,
  PartFloor,
  Site,
  SiteWithBuildings
} from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Business as BusinessIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Layers as FloorIcon,
  LocationOn as LocationIcon,
  Inventory as LotIcon,
  ViewModule as PartIcon,
} from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface HierarchyNode {
  id: string;
  type: 'company' | 'site' | 'building' | 'part' | 'building-floor' | 'part-floor' | 'lot';
  name: string;
  data: Company | Site | Building | Part | BuildingFloor | PartFloor | Lot;
  children: HierarchyNode[];
  parent?: HierarchyNode;
  level: number;
}

interface HierarchyTreeProps {
  companies: Company[];
  sites: SiteWithBuildings[]; // Use extended type that includes buildings
  onSelectCompany: (company: Company | null) => void;
  onSelectSite: (site: Site | null) => void;
  onSelectBuilding: (building: Building | null) => void;
  onSelectPart: (part: Part | null) => void;
  onSelectFloor: (floor: BuildingFloor | PartFloor | null) => void;
  onSelectLot: (lot: Lot | null) => void;
  onAddEntity: (type: string, parent?: any) => void;
  onEditEntity: (type: string, entity: any) => void;
  onDeleteEntity: (type: string, entity: any) => void;
}

const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  companies,
  sites,
  onSelectCompany,
  onSelectSite,
  onSelectBuilding,
  onSelectPart,
  onSelectFloor,
  onSelectLot,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
}) => {
  const theme = useTheme();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);

  // Build hierarchy tree
  useEffect(() => {
    const buildHierarchy = (): HierarchyNode[] => {
      return companies.map(company => {
        const companySites = sites.filter(site => site.companyId === company.id);

        const companyNode: HierarchyNode = {
          id: `company-${company.id}`,
          type: 'company',
          name: company.name,
          data: company,
          children: [],
          level: 0,
        };

        companyNode.children = companySites.map(site => {
          const siteNode: HierarchyNode = {
            id: `site-${site.id}`,
            type: 'site',
            name: site.name,
            data: site,
            children: [],
            parent: companyNode,
            level: 1,
          };

          // Add buildings
          if (site.buildings) {
            site.buildings.forEach((building: Building) => {
              const buildingNode: HierarchyNode = {
                id: `building-${building.id}`,
                type: 'building',
                name: building.name,
                data: building,
                children: [],
                parent: siteNode,
                level: 2,
              };

              // For now, we'll add a placeholder structure
              // This will be populated when we have the actual data from API

              siteNode.children.push(buildingNode);
            });
          }

          return siteNode;
        });

        return companyNode;
      });
    };

    setHierarchyData(buildHierarchy());
  }, [companies, sites]);

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
        onSelectCompany(node.data as Company);
        break;
      case 'site':
        onSelectSite(node.data as Site);
        break;
      case 'building':
        onSelectBuilding(node.data as Building);
        break;
      case 'part':
        onSelectPart(node.data as Part);
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

  return (
    <Card sx={{ p: 2, height: '100%', overflow: 'auto' }}>
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

      {hierarchyData.length === 0 ? (
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
            Aucune entreprise trouvée
          </Typography>
          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Commencez par créer une entreprise
          </Typography>
        </Box>
      ) : (
        <Box>
          {hierarchyData.map(node => renderNode(node))}
        </Box>
      )}
    </Card>
  );
};

export default HierarchyTree; 