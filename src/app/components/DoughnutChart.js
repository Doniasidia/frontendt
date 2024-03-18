// DoughnutChart.js
"use client";
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";


export default function DoughnutChart({ chartData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "doughnut",
        data: chartData,
        options: {
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 10,
                font: {
                  size: 12
                }
                
              }
            }
          },
          aspectRatio: 1.5, // Aspect ratio for maintaining the doughnut shape
          cutout: '45%', // Adjust the cutout to make the doughnut smaller
          layout: {
            padding: 30
          
          }
        },
          
        
            
          
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