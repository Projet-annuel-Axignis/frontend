'use client';

import { useSiteContext } from '../_providers/SiteProvider';
import BuildingsTab from './BuildingsTab';

export default function BuildingsPage() {
  const { site, showNotification, isDeleted } = useSiteContext();

  if (!site) {
    return null;
  }

  return (
    <BuildingsTab
      siteId={site.id}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 