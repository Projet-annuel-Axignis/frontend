import { Plans } from '@/types/plans';
import { Metadata } from 'next';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: "Axignis - Demande de devis de souscription",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { p = Plans.ADMIN_MANAGED } = await searchParams;
  const initialPlan = p === Plans.SELF_MANAGED ? Plans.SELF_MANAGED : Plans.ADMIN_MANAGED;

  return <RegisterForm initialPlan={initialPlan} />;
}