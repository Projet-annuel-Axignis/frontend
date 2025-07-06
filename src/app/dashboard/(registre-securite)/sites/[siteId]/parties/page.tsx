'use client';

import { useParams } from 'next/navigation';
import PartsTab from '../_components/PartsTab';
import { useSiteContext } from '../_providers/SiteProvider';

export default function PartiesPage() {
  const params = useParams();
  const siteId = parseInt(params.siteId as string);
  const { isDeleted, showNotification } = useSiteContext();

  return (
    <PartsTab
      siteId={siteId}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 