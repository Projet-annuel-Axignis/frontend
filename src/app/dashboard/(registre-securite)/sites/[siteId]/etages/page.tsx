'use client';

import { useSiteContext } from '../_providers/SiteProvider';
import FloorsTab from './FloorsTab';

export default function FloorsPage() {
  const { site, showNotification, isDeleted } = useSiteContext();

  if (!site) {
    return null;
  }

  return (
    <FloorsTab
      siteId={site.id}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 