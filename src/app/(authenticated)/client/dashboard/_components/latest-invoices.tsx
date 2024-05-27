import {ArrowPathIcon} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {lusitana} from "@/components/fonts";
import {fetchLatestInvoices} from "@/app/lib/client/data";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default async function LatestInvoices() {
    const latestInvoices = await fetchLatestInvoices();

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Dernières factures
            </h2>
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
                <div className="bg-white px-6">
                    {latestInvoices.map((invoice, i) => {
                        return (
                            <div
                                key={invoice.id}
                                className={clsx(
                                    'flex flex-row items-center justify-between py-4',
                                    {
                                        'border-t': i !== 0,
                                    },
                                )}
                            >
                                <div className="flex items-center">
                                    <Avatar className="h-12 w-12 mr-4 rounded-full bg-gray-200">
                                        <AvatarImage alt="Avatar" src="" />
                                        <AvatarFallback>{invoice?.subscriberName?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold md:text-base">
                                            {invoice.subscriberName}
                                        </p>
                                        <p className="hidden text-sm text-gray-500 sm:block">
                                            {invoice.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                                >
                                    {`${invoice.amount} TND`}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500 ">mise à jour à l'instant</h3>
                </div>
            </div>
        </div>
    );
}