import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Axignis - Connexion",
};


export default function LoginPage() {
  return <LoginForm />;
} 