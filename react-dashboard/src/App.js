import logo from './logo.svg';
import './App.css';
import ChartView from './components/ecg-chart'
import getVoltageData from './components/ecg-format'
import { useEffect, useState } from 'react';
import ecgData from './ecg.json'




function App() {
  const [data, setData] = useState()
  useEffect(() => {setData(getVoltageData(ecgData))}, [])
  return (
    <div className="App">
      <ChartView data={data}/>
    </div>
  );
}

export default App;
