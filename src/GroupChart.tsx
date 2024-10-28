import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _ from 'lodash';
import { ArrowUpDown } from 'lucide-react';

const GroupedChartDemo = () => {
  // Sample data with groups (departments) and individual data points (employees)
  const initialData = [
    { department: 'Engineering', name: 'Alice', productivity: 87 },
    { department: 'Engineering', name: 'Bob', productivity: 92 },
    { department: 'Engineering', name: 'Charlie', productivity: 78 },
    { department: 'Sales', name: 'David', productivity: 95 },
    { department: 'Sales', name: 'Eve', productivity: 88 },
    { department: 'Marketing', name: 'Frank', productivity: 82 },
    { department: 'Marketing', name: 'Grace', productivity: 91 },
    { department: 'Marketing', name: 'Henry', productivity: 85 }
  ];

  // Color mapping for departments
  const departmentColors = {
    'Engineering': '#8884d8',
    'Sales': '#82ca9d',
    'Marketing': '#ffc658'
  };

  const [groupSortOrder, setGroupSortOrder] = useState<"asc">('asc');
  const [itemSortOrder, setItemSortOrder] = useState<"desc">('desc');

  // Process and sort the data
  const processData = () => {
    // First, group the data by department
    let grouped = _.groupBy(initialData, 'department');
    
    // Calculate department averages and sort items within each group
    let processedData = Object.entries(grouped).map(([dept, items]) => {
      const sortedItems = _.orderBy(items, ['productivity'], [itemSortOrder]);
      const avgProductivity = _.meanBy(items, 'productivity');
      
      return {
        department: dept,
        items: sortedItems,
        avgProductivity,
        color: departmentColors[dept]
      };
    });

    // Sort the groups based on average productivity
    processedData = _.orderBy(processedData, ['avgProductivity'], [groupSortOrder]);

    return processedData;
  };

  const data = processData();

  // Transform data for the chart
  const chartData = data.flatMap(group => 
    group.items.map(item => ({
      name: item.name,
      productivity: item.productivity,
      department: group.department,
      color: departmentColors[group.department]
    }))
  );

  const toggleGroupSort = () => {
    setGroupSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const toggleItemSort = () => {
    setItemSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Custom shape for bars to apply department-specific colors
  const CustomBar = (props) => {
    const { fill, x, y, width, height } = props;
    return <rect x={x} y={y} width={width} height={height} fill={props.payload.color} />;
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <div className="mb-4 flex gap-4">
        <button
          onClick={toggleGroupSort}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sort Groups {groupSortOrder === 'asc' ? '↑' : '↓'}
          <ArrowUpDown className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItemSort}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sort Items {itemSortOrder === 'asc' ? '↑' : '↓'}
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-bold">{data.name}</p>
                      <p>Department: {data.department}</p>
                      <p>Productivity: {data.productivity}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="productivity" 
              name="Productivity Score"
              shape={<CustomBar />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Display grouped data */}
      <div className="mt-8">
        {data.map(group => (
          <div key={group.department} className="mb-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: group.color }}
              />
              {group.department} (Avg: {group.avgProductivity.toFixed(1)})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.items.map(item => (
                <div 
                  key={item.name}
                  className="p-4 rounded"
                  style={{ 
                    backgroundColor: `${group.color}20`,
                    borderLeft: `4px solid ${group.color}`
                  }}
                >
                  <p className="font-medium">{item.name}</p>
                  <p>Productivity: {item.productivity}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedChartDemo;