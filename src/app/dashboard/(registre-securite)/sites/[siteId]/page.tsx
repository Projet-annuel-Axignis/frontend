'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SiteDetailPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // Redirige automatiquement vers la première tab
    router.replace(`/dashboard/sites/${params.siteId}/batiments`);
  }, [router, params.siteId]);

  return null; // Cette page ne s'affiche jamais car elle redirige
} 