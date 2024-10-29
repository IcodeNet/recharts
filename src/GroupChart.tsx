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
  const initialData = [
    { group: "a++", label: "a", value: 87 },
    { group: "a++", label: "b", value: 92 },
    { group: "a++", label: "c", value: 78 },
    { group: "a", label: "d", value: 95 },
    { group: "a", label: "e", value: 88 },
    { group: "a-", label: "f", value: 82 },
    { group: "a-", label: "g", value: 91 },
    { group: "a-", label: "h", value: 85 },
  ];

  const groupColors = {
    "a++": "#8884d8",
    a: "#82ca9d",
    "a-": "#ffc658",
  };

  const [groupSortOrder, setGroupSortOrder] = useState("asc");
  const [itemSortOrder, setItemSortOrder] = useState("desc");

  const processData = () => {
    const grouped = _.groupBy(initialData, "group");

    let processedData = Object.entries(grouped).map(([dept, items]) => {
      const sortedItems = _.orderBy(items, ["value"], [itemSortOrder]);
      const avgValue = _.meanBy(items, "value");

      return {
        group: dept,
        items: sortedItems,
        avgValue,
        color: groupColors[dept],
      };
    });

    processedData = _.orderBy(processedData, ["avgValue"], [groupSortOrder]);
    return processedData;
  };

  const data = processData();

  const chartData = data.flatMap((group, groupIndex) => {
    const items = group.items.map((item, index) => ({
      label: item.label,
      value: item.value,
      group: group.group,
      color: groupColors[group.group],
      isLastInGroup: index === group.items.length - 1,
      isFirstInGroup: index === 0,
      isSeparator: false,
    }));

    if (groupIndex < data.length - 1) {
      items.push({
        label: `${group.group}-separator`,
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

  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload } = props;

    if (payload.isSeparator) {
      return null;
    }

    return (
      <rect x={x} y={y} width={width} height={height} fill={payload.color} />
    );
  };

  const CustomXAxisTick = (props) => {
    const { x, y, payload, index } = props;

    if (payload[index].isSeparator) {
      return (
        <g transform={`translate(${x},${y})`}>
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-400} // Adjust this value based on your chart height
            stroke="#666"
            strokeDasharray="4 4"
          />
        </g>
      );
    }
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={8}
          textAnchor="middle"
          fill="#666"
          fontSize="12px"
        >
          {payload[index].label}
        </text>
        {payload[index].isFirstInGroup && (
          <text
            x={0}
            y={0}
            dy={24}
            dx={24}
            textAnchor="middle"
            fill="#666"
            fontSize="12px"
            fontStyle="italic"
          >
            {payload[index].group}
          </text>
        )}
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
              dataKey="label"
              interval={0}
              tick={(props) => (
                <CustomXAxisTick {...props} payload={chartData} />
              )}
              height={60}
            />
            <YAxis
              label={{
                value: "Interest Rates (APR)",
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
                      <p>Interest: {data.value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="value" name="Interest Rate" shape={<CustomBar />} />
            {chartData.map((item, index) =>
              item.isSeparator ? (
                <ReferenceLine
                  key={`separator-${index}`}
                  x={item.label}
                  stroke="#ccc"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        {data.map((group) => (
          <div key={group.group} className="mb-6">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: group.color }}
              />
              {group.group} (Avg: {group.avgValue.toFixed(1)})
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
                  <p>Interest rate: {item.value}</p>
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
