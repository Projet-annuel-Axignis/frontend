'use client';

import { useParams } from 'next/navigation';
import BuildingsTab from '../_components/BuildingsTab';
import { useSiteContext } from '../_providers/SiteProvider';

export default function BatimentsPage() {
  const params = useParams();
  const siteId = parseInt(params.siteId as string);
  const { isDeleted, showNotification } = useSiteContext();

  return (
    <BuildingsTab
      siteId={siteId}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 