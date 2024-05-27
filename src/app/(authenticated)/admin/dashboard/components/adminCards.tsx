import { fetchCardData } from "@/app/lib/admin/data";
import { lusitana } from "@/components/fonts";
import { UsersIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

const iconMap = {
  subscribers: UserGroupIcon,
  clients: UsersIcon,  
  total: UserIcon,
};

export default async function CardWrapper() {
  const { numberOfClients, numberOfSubscribers, totalClientsAndSubscribers } = await fetchCardData();
  
  return (
    <>
      <Card title="Total des clients" value={numberOfClients} type="clients" />
      <Card title="Total des abonnés" value={numberOfSubscribers} type="subscribers" />
      <Card title="Total clients et abonnés" value={totalClientsAndSubscribers} type="total" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "clients" | "subscribers" | "total";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
        {value}
      </p>
    </div>
  );
}
