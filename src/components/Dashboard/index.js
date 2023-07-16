import { useState, useEffect } from 'react';
import ECGChartView from '../ECGChartView';
import getVoltageData from '../ecg-format';
import Container from 'react-bootstrap/Container';

export default function Dashboard({ ecgdata }) {
   const [data, setData] = useState();

   useEffect(() => {
      if (ecgdata) {
         setData(getVoltageData(ecgdata));
      }
   }, [ecgdata]);

return (

   data && 
   <Container>
      <ECGChartView data={data[0]} /> 
      <ECGChartView data={data[1]} /> 
      <ECGChartView data={data[2]} />
   </Container>

);  
}