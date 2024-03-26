//Admin/dashboard
import DoughnutChart from "../../components/DoughnutChart";

import  React  from "react";
import Layout from "../adminLayout";

const Dashboard = () => {
    const clientData = {
        labels: ["Nouveaux", "Anciens"],
        datasets: [
          {
            label: "Info",
            data: [55, 45],
            backgroundColor: ["rgb(22, 91, 170)", "rgb(90, 228, 168)"],
           
          },
        ],
      };
    
      const totalData = {
        labels: ["Actifs", "Inactifs"],
        datasets: [
          {
            label: "Info",
            data: [70, 30],
            backgroundColor: ["rgb(22, 91, 170)", "rgb(90, 228, 168)"],
            
          },
        ],
      };
    
      return (
        <Layout activePage="dashboard"> 
       
            <div className="flex items-center p-4"> {/* Select box for months */}
              <div className="mr-12"> {/* Margin right for spacing */}
                
              </div>
              <br/>
              <br/>
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
                  {/* Add more options for other months */}
                </select>
              </div>
            </div>
    
            <div className="flex flex-grow p-4 pl-16 "> {/* Main content area */}
              <div className="grid grid-cols-2 gap-20"> {/* Grid for charts */}
                <div className="bg-white p-4 rounded-md shadow-lg h-80 w-80">
                <h3>
                <span className="text-zinc-500 font-semibold ">Client</span> <br/>
                <span className="text-blue-950 text-4xl font-semibold ">200</span> <br/>
                <span className="text-slate-600 ">nombre total des clients</span>
                </h3>
                  <div className="border-t border-gray-400 p-1.5 "></div>                
                  <div className="h-60">
                  <DoughnutChart chartData={clientData} />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md shadow-lg h-80 w-80">
                <h3>
                <span className="text-zinc-500 font-semibold ">abonnement</span> <br/>
                <span className="text-blue-950 text-4xl font-semibold ">600</span> <br/>
                <span className="text-slate-600">nombre total d'abonnements</span>
                </h3>
                  <div className="border-t border-gray-400 p-1.5 "></div>
                  <div className="h-60">
                  <DoughnutChart chartData={totalData} />
                  </div>
                </div>
              </div>
            </div>
          
       </Layout>
      );
    }

export default Dashboard
