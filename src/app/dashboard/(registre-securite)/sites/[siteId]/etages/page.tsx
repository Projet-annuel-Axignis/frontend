'use client';

import { useParams } from 'next/navigation';
import FloorsTab from '../_components/FloorsTab';
import { useSiteContext } from '../_providers/SiteProvider';

export default function EtagesPage() {
  const params = useParams();
  const siteId = parseInt(params.siteId as string);
  const { isDeleted, showNotification } = useSiteContext();

  return (
    <FloorsTab
      siteId={siteId}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 