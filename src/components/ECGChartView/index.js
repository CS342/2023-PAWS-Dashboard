import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function ECGChartView({ data }) {

   const gridLines = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
   

   return (
      <ResponsiveContainer minWidth="600" height={250}>
         <LineChart
            margin={{
               top: 10,
               right: 20,
               left: 20,
               bottom: 20,
            }}
         >
            <CartesianGrid strokeDasharray="0 0" />

            <YAxis
               dataKey="y"
               domain={['dataMin', 'dataMax']}
               type="number"
               interval={0}
               hide
               ticks={gridLines(-0.5, 1, 0.1)} 
               label={{
                  value: `Voltage (mV)`,
                  style: { textAnchor: 'middle' },
                  angle: -90,
                  position: 'left',
                  offset: 0,
               }}
               allowDataOverflow
               strokeWidth={1}
            />

            <XAxis
               dataKey="x"
               hide
               domain={['dataMin', 'dataMax']}
               interval={0}
               ticks={gridLines(data[0].x, data[0].x + 10, 0.04)} 
               type="number"
               label={{
                  key: 'xAxisLabel',
                  value: 'Time (s)',
                  position: 'bottom',
               }}
               allowDataOverflow
               strokeWidth={1}
            />

            <Line
               strokeWidth={2}
               data={data}
               dot={false}
               type="monotone"
               dataKey="y"
               stroke="black"
               tooltipType="none"
            />
         </LineChart>
      </ResponsiveContainer>
   );
}


