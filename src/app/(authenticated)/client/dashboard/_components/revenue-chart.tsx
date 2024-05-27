import { CalendarIcon } from '@heroicons/react/24/outline';
import { fetchRevenue } from '@/app/lib/client/data';
import { lusitana } from "@/components/fonts";
import { generateYAxis } from "@/utils/chartUtil";
import DateFormat from "@/utils/dateFormatUtils";

export default async function RevenueChart() {
    const revenue = await fetchRevenue();

    const chartHeight = 350;
    const { yAxisLabels, topLabel } = generateYAxis(revenue);

    if (!revenue || revenue.length === 0) {
        return <p className="mt-4 text-gray-400">No data available.</p>;
    }

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Revenu récent
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="mt-0 grid grid-cols-12 items-end gap-4 rounded-md bg-white p-4 sm:grid-cols-13 md:gap-6">
                    {/* y-axis */}
                    <div
                        className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
                        style={{ height: `${chartHeight}px` }}
                    >
                        {yAxisLabels.map((label) => (
                            <p key={label}>{label}</p>
                        ))}
                    </div>

                    {revenue.map((rve) => (
                        <div key={rve.date} className="flex flex-col items-center gap-2">
                            {/* bars */}
                            <div
                                className="w-full rounded-md bg-blue-300"
                                style={{
                                    height: `${(chartHeight / topLabel) * rve.amount}px`,
                                }}
                            ></div>
                            {/* x-axis */}
                            <p className="-rotate-90 text-[10px] text-gray-400 sm:rotate-0">
                                {DateFormat.getFormattedDate(rve.date)}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <CalendarIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500">Les 12 derniers mois</h3>
                </div>
            </div>
        </div>
    );
}
