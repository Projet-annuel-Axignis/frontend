'use client';

import { useSiteContext } from '../_providers/SiteProvider';
import LotsTab from './LotsTab';

export default function LotsPage() {
  const { site, showNotification, isDeleted } = useSiteContext();

  if (!site) {
    return null;
  }

  return (
    <LotsTab
      siteId={site.id}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 