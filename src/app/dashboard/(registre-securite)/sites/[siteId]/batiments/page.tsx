'use client';

import { useParams } from 'next/navigation';
import { useSiteContext } from '../_providers/SiteProvider';
import BuildingsTab from './BuildingsTab';

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