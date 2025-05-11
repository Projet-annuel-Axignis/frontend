import { Plans } from '@/types/plans';
import RegisterForm from './RegisterForm';

interface RegisterPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const planParam = searchParams.p as string;
  const initialPlan = planParam === Plans.SELF_MANAGED ? Plans.SELF_MANAGED : Plans.ADMIN_MANAGED;

  return <RegisterForm initialPlan={initialPlan} />;
}