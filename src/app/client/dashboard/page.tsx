//client/dashboard
"use client";
import React from "react";
import Layout from "../clientLayout";
import BarChart from "../../components/BarChart"; // Import BarChart component
import MultiAxisLineChart from "../../components/MultiAxisLineChart";

const Dashboard = () => {
    const chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
       
          {
            label: "Nombre d'abonnements",
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: "rgb(22, 71, 170)",
            backgroundColor: "rgb(22, 71, 170)",
            yAxisID: 'y1',
          },
        ],};
  const totalData = {
    labels: ["Payé", "Non payé"],
    datasets: [
      {
        label:"Payé",
        data: [70, 30],
        backgroundColor: ["rgb(25, 242, 148)", "rgb(22, 71, 170)"]
      },
      {
        label:"Non payé",
        data: [70, 30],
        backgroundColor: [ "rgb(22, 71, 170)"]
      }
    ]
  };

  return (
    <Layout activePage="dashboard">
      <div className="flex items-center p-4">
      <div className="mr-12"> {/* Margin right for spacing */}
          
        </div>
        <br />
        <br />
        <div>
        <select className=" border-blue-400 bg-white text-gray-900 rounded-md px-2 py-1 w-60 border-blue-500/75 border-2">
            <option value="january">Janvier</option>
            <option value="february">Février</option>
            <option value="march">Mars</option>
            <option value="april">Avril</option>
            <option value="may">Mai</option>
            <option value="june">Juin</option>
            <option value="july">Juillet</option>
            <option value="august">Août</option>
            <option value="september">Septembre</option>
            <option value="october">Octobre</option>
            <option value="november">Novembre</option>
            <option value="december">Décembre</option>
          </select>
        </div>
      </div>

      <div className="flex flex-grow p-4 pl-16 ">
        <div className="grid grid-cols-2 gap-20">
          <div className="bg-white p-4 rounded-md shadow-lg h-80 w-80">
            <h3>
              <span className="text-zinc-500 font-semibold ">Abonnement</span>{" "}
              <br />
              <span className="text-blue-950 text-4xl font-semibold ">600</span>{" "}
              <br />
              <span className="text-slate-600 ">nombre total d'abonnements</span>
            </h3>
            <div className="border-t border-gray-400 p-1.5 "></div>
            <div className="h-60 ">
        
<div className="h-800"> {/* Change the height class or specify a fixed height */}
    <MultiAxisLineChart chartData={chartData} />
</div>

            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-lg h-80 w-80">
            <h3>
              <span className="text-zinc-500 font-semibold ">Payment</span>{" "}
              <br />
              <span className="text-blue-950 text-4xl font-semibold ">100</span>{" "}
              <br />
              <span className="text-slate-600">
                nombre total de payment
              </span>
            </h3>
            <div className="border-t border-gray-400 p-1.5 "></div>
            <div className="h-60">
              <BarChart chartData={totalData} /> {/* Use BarChart component */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
