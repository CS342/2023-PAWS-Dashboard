import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

function ChartView({ data }) {
   return (
      <ResponsiveContainer minWidth="400" height={444}>
         <LineChart
            margin={{
               top: 10,
               right: 20,
               left: 20,
               bottom: 20,
            }}
         >
            <CartesianGrid strokeDasharray="3 3" />

            <YAxis
               dataKey="y"
               domain={['auto', 'auto']}
               type="number"
               interval={0}
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
               domain={['auto', 'auto']}
               interval={0}
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

export default ChartView;
