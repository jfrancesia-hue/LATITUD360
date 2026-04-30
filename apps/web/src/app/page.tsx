import { redirect } from "next/navigation";

export default function RootPage() {
  // Auth check delegado al middleware. Si llegó hasta acá → ir a dashboard.
  redirect("/dashboard");
}
