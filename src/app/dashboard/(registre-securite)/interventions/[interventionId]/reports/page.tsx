'use client';

import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useParams } from 'next/navigation';
import ReportsTab from './ReportsTab';

export default function InterventionReportsPage() {
  const params = useParams();

  useBreadcrumbTitle('reports', 'Rapports d\'intervention');

  const interventionId = parseInt(params.interventionId as string);

  const handleNotification = (message: string, severity: 'success' | 'error') => {
    // Cette fonction sera gérée par le contexte parent ou un provider de notifications
    console.log(`${severity}: ${message}`);
  };

  return (
    <ReportsTab
      interventionId={interventionId}
      onNotification={handleNotification}
    />
  );
} 