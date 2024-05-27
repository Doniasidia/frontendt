import { CLIENTS_API, SUBSCRIBERS_API } from '@/utils/apiUtil';
import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';

export async function fetchCardData() {
    noStore();
    const cookiesInfo = cookies();
    try {
        const cookieSession = cookiesInfo.get("session")?.value || "{}";
        const session: Session = JSON.parse(cookieSession);
        const headers = {
            Authorization: `Bearer ${session.access_token}`,
        };

        const data = await Promise.all([
            axios.get(CLIENTS_API, { headers }),
            axios.get(`${SUBSCRIBERS_API}/allsubscribers`, { headers })
        ]);

        const numberOfClients = Number(data[0]?.data?.length ?? '0');
        const numberOfSubscribers = Number(data[1]?.data?.length ?? '0');
        const totalClientsAndSubscribers = numberOfClients + numberOfSubscribers;

        return {
            numberOfClients,
            numberOfSubscribers,
            totalClientsAndSubscribers,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}
