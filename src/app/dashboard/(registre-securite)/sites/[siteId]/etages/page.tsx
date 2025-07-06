'use client';

import { useParams } from 'next/navigation';
import { useSiteContext } from '../_providers/SiteProvider';
import FloorsTab from './FloorsTab';

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