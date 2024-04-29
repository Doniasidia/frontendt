//client/paiement 
"use client";
import React from "react";
import Layout from "../clientLayout";

const TdStyle = {
  ThStyle : 'border-l border-transparent py-2 px-3 text-base font-medium lg:py-4 lg:px-4 bg-custom-blue' ,
  TdStyle: 'text-dark border-b border-l border-transparent border-[#E8E8E8] bg-sky-100 dark:border-dark dark:text-dark-7 py-1 px-3 text-center text-sm font-medium',
};

const Paiements = () => {
  return (
    <Layout activePage="paiement">
      <div className=" table-wrapper mt-20">
      <div className='flex justify-center mx-2 w-full  '>
        <div className='w-full max-w-[90%] rounded-xl  table-wrapper'>
          <table className='w-full table-auto border-collapse rounded-xl '>
            <thead className='text-center bg-primary'>
                <tr>
                  <th className={TdStyle.ThStyle}> Nom d'abonné  </th>
                  <th className={TdStyle.ThStyle}> Prix </th>
              
                  <th className={TdStyle.ThStyle}> Status de Paiement </th>
                  <th className={TdStyle.ThStyle}> méthode de paiement </th>
                  <th className={TdStyle.ThStyle}> </th>
                  <th className={TdStyle.ThStyle}> </th>
                </tr>
              </thead>
              <tbody>
                {/* No rows */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Paiements;
