'use client';

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Link from 'next/link';

export default function PersistentNavBarLeft() {
    const theme = useTheme();

    const drawerWidth = 240;

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    top: '64px', // pour ne pas empiéter sur le header s’il fait 64px de haut
                    height: 'calc(100% - 64px)', // hauteur totale moins celle du header
                    backgroundColor: '#063970', // couleur de fond
                    borderRight: `1px solid ${theme.palette.divider}`,
                },
            }}
        >
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem>
                        <Link href="#mission" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Domaine d'équipements" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="#services" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary="Famille d'équipements" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="#contact" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <ContactMailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Types d'équipements" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="#contact" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <ContactMailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Marques" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="#contact" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <ContactMailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Documents" />
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link href="#contact" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
                            <ListItemIcon style={{ color: 'white' }}>
                                <ContactMailIcon />
                            </ListItemIcon>
                            <ListItemText primary="Produits" />
                        </Link>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
