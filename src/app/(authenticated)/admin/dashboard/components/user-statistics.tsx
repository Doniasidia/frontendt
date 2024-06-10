"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from "@/components/fonts";
import DateFormat from "@/utils/dateFormatUtils";
import { CLIENTS_API, SUBSCRIBERS_API } from '@/utils/apiUtil';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type DataPoint = { date: string, count: number };

async function fetchClientsAndSubscribers() {
  try {
    const [clientsResponse, subscribersResponse] = await Promise.all([
      axios.get(CLIENTS_API),
      axios.get(`${SUBSCRIBERS_API}/allsubscribers`)
    ]);

    return {
      clients: clientsResponse.data,
      subscribers: subscribersResponse.data
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { clients: [], subscribers: [] };
  }
}

function aggregateData(items: { createdAt: string }[]): DataPoint[] {
  const counts: { [key: string]: number } = {};

  items.forEach(item => {
    const date = new Date(item.createdAt);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (!counts[monthYear]) {
      counts[monthYear] = 0;
    }
    counts[monthYear]++;
  });

  const cumulativeCounts: DataPoint[] = [];
  let cumulativeSum = 0;

  Object.keys(counts).sort().forEach(monthYear => {
    cumulativeSum += counts[monthYear];
    cumulativeCounts.push({ date: monthYear, count: cumulativeSum });
  });

  return cumulativeCounts;
}

async function prepareChartData() {
  const { clients, subscribers } = await fetchClientsAndSubscribers();
  const clientData = aggregateData(clients);
  const subscriberData = aggregateData(subscribers);

  // Combine and sort all unique month-year
  const allDates = Array.from(new Set([...clientData.map(item => item.date), ...subscriberData.map(item => item.date)])).sort();

  // Create unified labels
  const labels = allDates.map(date => DateFormat.getFormattedMonthYear(date));

  // Align data points with unified labels
  const clientCounts = allDates.map(date => {
    const dataPoint = clientData.find(item => item.date === date);
    return dataPoint ? dataPoint.count : 0;
  });

  const subscriberCounts = allDates.map(date => {
    const dataPoint = subscriberData.find(item => item.date === date);
    return dataPoint ? dataPoint.count : 0;
  });

  return { labels, clientCounts, subscriberCounts };
}

export default function ClientSubscriberChart() {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Clients',
        data: [] as number[],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Abonnés',
        data: [] as number[],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      const { labels, clientCounts, subscriberCounts } = await prepareChartData();

      console.log("Formatted Labels:", labels); // Debugging line
      console.log("Client Counts:", clientCounts); // Debugging line
      console.log("Subscriber Counts:", subscriberCounts); // Debugging line

      setChartData({
        labels,
        datasets: [
          {
            label: 'Clients',
            data: clientCounts,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
          },
          {
            label: 'Abonnés',
            data: subscriberCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });
    }

    fetchData();
  }, []);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Évolution des Clients et Abonnés
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <Bar data={chartData} />
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Évolution au cours du temps</h3>
        </div>
      </div>
    </div>
  );
}
