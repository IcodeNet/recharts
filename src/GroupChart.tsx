import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import _ from "lodash";
import { ArrowUpDown } from "lucide-react";

const GroupedChartDemo = () => {
  // Sample data with groups (departments) and individual data points (employees)
  const initialData = [
    { group: "Engineering", label: "Alice", value: 87 },
    { group: "Engineering", label: "Bob", value: 92 },
    { group: "Engineering", label: "Charlie", value: 78 },
    { group: "Sales", label: "David", value: 95 },
    { group: "Sales", label: "Eve", value: 88 },
    { group: "Marketing", label: "Frank", value: 82 },
    { group: "Marketing", label: "Grace", value: 91 },
    { group: "Marketing", label: "Henry", value: 85 },
  ];

  // Color mapping for departments
  const groupColors: { [key: string]: string } = {
    Engineering: "#8884d8",
    Sales: "#82ca9d",
    Marketing: "#ffc658",
  };

  const [groupSortOrder, setGroupSortOrder] = useState<"asc" | "desc">("asc");
  const [itemSortOrder, setItemSortOrder] = useState<"asc" | "desc">("desc");

  // Process and sort the data
  const processData = () => {
    // First, group the data by group
    const grouped = _.groupBy(initialData, "group");

    // Calculate group averages and sort items within each group
    let processedData = Object.entries(grouped).map(([dept, items]) => {
      const sortedItems = _.orderBy(items, ["value"], [itemSortOrder]);
      const avgProductivity = _.meanBy(items, "value");

      return {
        group: dept,
        items: sortedItems,
        avgProductivity,
        color: groupColors[dept as keyof typeof groupColors],
      };
    });

    // Sort the groups based on average value
    processedData = _.orderBy(
      processedData,
      ["avgProductivity"],
      [groupSortOrder]
    );

    return processedData;
  };

  const data = processData();

  // Transform data for the chart with separation indicators
  const chartData = data.flatMap((group, groupIndex) => {
    // Add the items for this group
    const items = group.items.map((item, index) => ({
      label: item.label,
      fullName: `${item.label}\n${group.group}`, // Add group to label
      value: item.value,
      group: group.group,
      color: groupColors[group.group],
      isLastInGroup: index === group.items.length - 1,
      isSeparator: false, // Add isSeparator property
    }));

    // If this isn't the last group, add a separator item
    if (groupIndex < data.length - 1) {
      items.push({
        label: `${group.group}-separator`,
        fullName: "",
        value: 0,
        group: group.group,
        isSeparator: true,
      });
    }

    return items;
  });

  const toggleGroupSort = () => {
    setGroupSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleItemSort = () => {
    setItemSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Custom shape for bars to apply group-specific colors
  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload } = props;

    // Don't render separator bars
    if (payload.isSeparator) {
      return null;
    }

    return (
      <rect x={x} y={y} width={width} height={height} fill={payload.color} />
    );
  };

  // Custom X Axis Label
  const CustomXAxisTick = (props) => {
    const { x, y, payload } = props;
    const lines = payload.value.split("\n");

    if (!lines[0]) return null; // Don't render labels for separators

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Employee label */}
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
          {lines[0]}
        </text>
        {/* Group label */}
        {/*  <text
          x={0}
          y={0}
          dy={32}
          textAnchor="middle"
          fill="#666"
          fontSize="smaller"
          fontStyle="italic"
        >
          {lines[1]}
        </text> */}
      </g>
    );
  };

  return (
    <div className="w-full max-w-6xl p-4">
      <div className="mb-4 flex gap-4">
        <button
          onClick={toggleGroupSort}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sort Groups {groupSortOrder === "asc" ? "↑" : "↓"}
          <ArrowUpDown className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItemSort}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sort Items {itemSortOrder === "asc" ? "↑" : "↓"}
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      <div className="h-96 mt-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fullName"
              interval={0}
              tick={<CustomXAxisTick />}
              height={60}
            />
            <YAxis
              label={{
                value: "Productivity Score",
                angle: -90,
                position: "insideLeft",
                offset: -5,
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (
                  active &&
                  payload &&
                  payload.length &&
                  !payload[0].payload.isSeparator
                ) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p className="font-bold">{data.label}</p>
                      <p>Group: {data.group}</p>
                      <p>Productivity: {data.value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar
              dataKey="value"
              label="Productivity Score"
              shape={<CustomBar />}
            />
            {/* Add vertical separators between departments */}
            {chartData.map(
              (item, index) =>
                item.isSeparator && (
                  <ReferenceLine
                    key={`separator-${index}`}
                    x={item.label}
                    stroke="#ccc"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  />
                )
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Display grouped data */}
      <div className="mt-8">
        {data.map((group) => (
          <div key={group.group} className="mb-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              {group.group} (Avg: {group.avgProductivity.toFixed(1)})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded"
                  style={{
                    backgroundColor: `${group.color}20`,
                    borderLeft: `4px solid ${group.color}`,
                  }}
                >
                  <p className="font-medium">{item.label}</p>
                  <p>Productivity: {item.value}</p>
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
