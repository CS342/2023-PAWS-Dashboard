import { useState, useEffect } from 'react';
import ChartView from './ecg-chart';
import getVoltageData from './ecg-format';

export default function Dashboard({ ecgdata }) {
   const [data, setData] = useState();

   useEffect(() => {
      setData(getVoltageData(ecgdata));
   }, []);

   return <ChartView data={data} />;
}
