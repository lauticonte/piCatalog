'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatter } from '@/lib/utils'

interface OverviewProps {
  data: any[]
}

export const Overview: React.FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke='#eef1f3' />
        <XAxis dataKey='name' stroke='#8a949e' fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke='#8a949e'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={70}
          tickFormatter={value => formatter.format(value)}
        />
        <Tooltip
          cursor={{ fill: '#f4f6f7' }}
          formatter={(value: number) => [formatter.format(value), 'Consultado']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e3e7ea', fontSize: 12 }}
        />
        <Bar dataKey='total' fill='#3aa17e' radius={[4, 4, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}
