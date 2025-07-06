'use client';

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SiteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.siteId;

  useEffect(() => {
    // Rediriger vers le premier tab par défaut (batiments)
    router.replace(`/dashboard/sites/${siteId}/batiments`);
  }, [router, siteId]);

  return null; // Cette page ne s'affiche jamais car elle redirige
} 