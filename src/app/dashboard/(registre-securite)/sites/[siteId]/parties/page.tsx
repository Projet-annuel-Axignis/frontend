'use client';

import { useSiteContext } from '../_providers/SiteProvider';
import PartsTab from './PartsTab';

export default function PartsPage() {
  const { site, showNotification, isDeleted } = useSiteContext();

  if (!site) {
    return null;
  }

  return (
    <PartsTab
      siteId={site.id}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 