'use client';

import { useSiteContext } from '../_providers/SiteProvider';
import PartsTab from './PartsTab';

export default function PartsPage() {
  const { site, company, showNotification, isDeleted } = useSiteContext();

  if (!site) {
    return null;
  }

  return (
    <PartsTab
      siteId={site.id}
      companyId={company?.id}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 