import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SalesChart = ({ data }) => {
  // 1. Safety Check: If data is loading or empty, show a clean placeholder
  if (!data || data.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" 
           style={{ width: '100%', height: 350, backgroundColor: '#f8f9fa', borderRadius: '15px', border: '2px dashed #dee2e6' }}>
        <i className="fas fa-chart-area mb-2 text-muted" style={{ fontSize: '2.5rem' }}></i>
        <p className="text-muted fw-bold">No Sales Data Available Yet</p>
        <small className="text-muted">Verified paid orders will appear here automatically.</small>
      </div>
    );
  }

  // 2. Find the highest sales value to scale the chart dynamically
  const maxSales = Math.max(...data.map((item) => item.sales));

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
        >
          {/* Defined Gradient for the "Fill" effect */}
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#198754" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#198754" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Background Grid - Horizontal lines only for a modern look */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

          {/* X-Axis: Month Names */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6c757d', fontSize: 13, fontWeight: 500 }}
            padding={{ left: 10, right: 10 }}
          />

          {/* Y-Axis: Currency values formatted in 'k' for thousands */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6c757d', fontSize: 12 }}
            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
            domain={[0, maxSales + (maxSales * 0.1)]} // Adds 10% space at the top
          />

          {/* Interactive Tooltip: Appears on hover */}
          <Tooltip
            cursor={{ stroke: '#198754', strokeWidth: 2, strokeDasharray: '5 5' }}
            contentStyle={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              padding: '10px 15px',
            }}
            formatter={(value) => [`${value.toLocaleString()} RWF`, 'Monthly Sales']}
            labelStyle={{ fontWeight: 'bold', marginBottom: '5px', color: '#333' }}
          />

          {/* The Main Data Line & Area */}
          <Area
            type="monotone" // Smooth curve
            dataKey="sales"
            stroke="#198754" // Bootstrap "Success" Green
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSales)"
            activeDot={{ r: 7, strokeWidth: 0, fill: '#198754' }}
            animationDuration={2000}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;