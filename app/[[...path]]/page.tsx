import Lernzi from "@/components/lernzi";
import { notFound } from "next/navigation";
const routes: Record<string, string> = {
  "": "Learn smarter, stress less",
  dashboard: "Dashboard",
  settings: "Settings",
  materials: "Study materials",
  upload: "Add material",
  flashcards: "Flashcards",
  "self-test": "Self-Test",
  quiz: "15-Minute Quiz",
  progress: "My progress",
  login: "Log in",
  signup: "Create account",
  "forgot-password": "Reset password",
  privacy: "Privacy Policy",
  cookies: "Cookie Policy",
  terms: "Terms of Service",
};
type Props = { params: Promise<{ path?: string[] }> };
export async function generateMetadata({ params }: Props) {
  const key = ((await params).path || []).join("/");
  return { title: `${routes[key] || "Page not found"} · Lernzi` };
}
export default async function Page({ params }: Props) {
  const key = ((await params).path || []).join("/");
  if (!(key in routes)) notFound();
  return <Lernzi />;
}
