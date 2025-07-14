'use client';

import interventionService from '@/services/interventionService';
import { Intervention } from '@/types/intervention';
import { useEffect, useState } from 'react';

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await interventionService.getAll();
        setInterventions(data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des interventions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Liste des interventions</h1>
      <ul>
        {interventions.map((intervention) => (
          <li key={intervention.id}>{intervention.label} - {intervention.status}</li>
        ))}
      </ul>
    </div>
  );
} 