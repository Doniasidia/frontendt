import {INVOICES_API, SUBSCRIBERS_API} from '@/utils/apiUtil';
import axios from 'axios';
import {unstable_noStore as noStore} from 'next/cache';
import {cookies} from 'next/headers';
import {sum} from "lodash";
   
export async function fetchCardData() {
    noStore();
    const cookiesInfo = cookies();
    try {

        const cookieSession = cookiesInfo.get("session")?.value || "{}";
        const session: Session = await JSON.parse(cookieSession);
        const headers = {
            Authorization: `Bearer ${session.access_token}`,
        };

        const data = await Promise.all([
            axios.get(INVOICES_API, {headers}),
            axios.get(SUBSCRIBERS_API, {headers})
        ]);

        const numberOfInvoices = Number(data[0]?.data?.length ?? '0');
        const numberOfCustomers = Number(data[1].data?.length ?? '0');
        const allPaidInvoices = sum(data[0].data?.filter((invoice: any) => invoice.status === 'paid')?.map((invoice: any) => Number.parseInt(invoice.amount ?? '0')));
        const allPendingInvoices = sum(data[0].data?.filter((invoice: any) => invoice.status === 'pending')?.map((invoice: any) => Number.parseInt(invoice.amount ?? '0')));

        const totalPaidInvoices = `${allPaidInvoices} TND`;
        const totalPendingInvoices = `${allPendingInvoices} TND`;

         return {
         numberOfCustomers,
         numberOfInvoices,
         totalPaidInvoices,
         totalPendingInvoices,
         };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

export async function fetchRevenue() {
    noStore();
    const cookiesInfo = cookies();
    try {
        const cookieSession = cookiesInfo.get("session")?.value || "{}";
        const session: Session = await JSON.parse(cookieSession);
        const headers = {
            Authorization: `Bearer ${session.access_token}`,
        };

        const data = await axios.get(INVOICES_API, {headers});
        return data.data.map((invoice: any) => {
            return {
                date: invoice.createdAt,
                amount: Number.parseInt(invoice.amount ?? '0'),
            };
        }) as  { date: string, amount: number }[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    noStore();
    const cookiesInfo = cookies();
    try {
        const cookieSession = cookiesInfo.get("session")?.value || "{}";
        const session: Session = await JSON.parse(cookieSession);
        const headers = {
            Authorization: `Bearer ${session.access_token}`,
        };

        const data = await axios.get(INVOICES_API, {headers});
        return data.data.map((invoice: any) => {
            return {
                id: invoice.id,
                subscriberName: invoice.subscriberName,
                status: invoice.status,
                createdAt: invoice.createdAt,
                amount: Number.parseInt(invoice.amount ?? '0'),
            };
        }) as  { id: string, amount: number , subscriberName: string, status: string, createdAt: string}[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}