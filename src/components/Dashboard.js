import { useState, useEffect } from 'react';
import ChartView from './ecg-chart'
import getVoltageData from './ecg-format'

export default function Dashboard() {
    const [data, setData] = useState()

    useEffect(() => {setData(getVoltageData(ecgData))}, [])

    return (
        <ChartView data={data}/>
    )
}