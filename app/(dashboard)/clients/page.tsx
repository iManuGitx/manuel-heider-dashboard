import { getClients } from "@/lib/queries/clients";
import { ClientsView } from "@/components/clients/clients-view";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsView clients={clients} />;
}
