//components/BarChart
"use client";
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

export default function BarChart({ chartData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "bar", // Change type to "bar" for vertical bar chart
        data: chartData,
        options: {
          plugins: {
            legend: {
              position: "top", // Change legend position to "top"
              labels: {
                boxWidth: 10,
                font: {
                  size: 12
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true // If you want a stacked bar chart
            },
            y: {
              beginAtZero: true
            }
          },
          barThickness: 30,
        }
      });
      chartRef.current.chart = newChart;
    }
  }, [chartData]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
