import { Plans } from '@/types/plans';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { p = Plans.ADMIN_MANAGED } = await searchParams;
  const initialPlan = p === Plans.SELF_MANAGED ? Plans.SELF_MANAGED : Plans.ADMIN_MANAGED;

  return <RegisterForm initialPlan={initialPlan} />;
}