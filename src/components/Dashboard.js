import { useState, useEffect } from 'react';
import ChartView from './ecg-chart';
import getVoltageData from './ecg-format';
// import { Stack } from '@mui/material';
import Container from 'react-bootstrap/Container';

export default function Dashboard({ ecgdata }) {
   const [data, setData] = useState();

   useEffect(() => {
      if (ecgdata) {
         setData(getVoltageData(ecgdata));
      }
   }, [ecgdata]);
   // return <ChartView data={data} /> 

return (

   data && 
   <Container>
      <ChartView data={data[0]} /> 
      <ChartView data={data[1]} /> 
      <ChartView data={data[2]} />
   </Container>

);  
}