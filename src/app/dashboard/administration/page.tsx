'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdministrationPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige automatiquement vers la première tab
    router.replace('/dashboard/administration/utilisateurs');
  }, [router]);

  return null; // Cette page ne s'affiche jamais car elle redirige
}