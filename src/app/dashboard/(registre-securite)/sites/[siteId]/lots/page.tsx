'use client';

import { useParams } from 'next/navigation';
import LotsTab from '../_components/LotsTab';
import { useSiteContext } from '../_providers/SiteProvider';

export default function LotsPage() {
  const params = useParams();
  const siteId = parseInt(params.siteId as string);
  const { isDeleted, showNotification } = useSiteContext();

  return (
    <LotsTab
      siteId={siteId}
      onNotification={showNotification}
      disabled={isDeleted}
    />
  );
} 