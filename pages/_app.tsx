// pages/index.tsx

import '../styles/globals.css'
import { AppProps } from 'next/app'; // Import the necessary type

const MyApp = ({ Component, pageProps }: AppProps) => {  return(

   <Component {...pageProps}/>
  )
  

};

export default MyApp; 
