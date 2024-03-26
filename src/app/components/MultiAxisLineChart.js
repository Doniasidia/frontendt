//components/ MultiAxisLineChart.jsx
import { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const MultiAxisLineChart = ({ chartData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
            },
            y1: {
              type: "linear",
              display: false,
              position: "right",
              grid: {
                drawOnChartArea: false,
              },
            },
          },
        },
      });
      chartRef.current.chart = newChart;
    }
  }, [chartData]);

  return <canvas ref={chartRef} />;
};

export default MultiAxisLineChart;
