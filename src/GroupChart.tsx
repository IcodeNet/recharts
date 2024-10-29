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

const GroupedChartDemo = ({ groupColors, initialData, legend, sublegend }) => {
  const [groupSortOrder, setGroupSortOrder] = useState("asc");
  const [itemSortOrder, setItemSortOrder] = useState("desc");

  const processData = () => {
    const grouped = _.groupBy(initialData, "group");

    let processedData = Object.entries(grouped).map(([grp, items]) => {
      const sortedItems = _.orderBy(items, ["value"], [itemSortOrder]);
      const avgValue = _.meanBy(items, "value");

      return {
        group: grp,
        items: sortedItems,
        avgValue,
        color: groupColors[grp],
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
      itemsCount: group.items.length,
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
    const { x, y, width, height, payload } = props;

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
            y2={-450} // Adjust this value based on your chart height
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
          {/*  {payload[index].label} */}
        </text>
        {payload[index].isFirstInGroup && (
          <text
            x={(payload[index].itemsCount * 20) / 2}
            y={0}
            dy={24}
            dx={24}
            textAnchor="middle"
            fill="#666"
            fontSize="14px"
            fontStyle="italic"
          >
            {payload[index].group}
          </text>
        )}
      </g>
    );
  };

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="recharts-default-legend">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {/*   {entry.value} */}
            <span className="block font-bold">{legend}</span>
            <span className="font-normal">{sublegend}</span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomYAxisLabel = ({ viewBox, value }) => {
    const { x, y, width, height } = viewBox;
    const cx = x + width / 2;
    const cy = y + height / 2;
    return (
      <text
        x={cx}
        y={cy}
        transform={`rotate(-90, ${cx - 24}, ${cy})`}
        textAnchor="middle"
        fill="#000"
        fontWeight={700}
        fontSize="14px"
      >
        {value}
      </text>
    );
  };

  const CustomYAxisTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y}
        dy={3}
        textAnchor="end"
        fill="#c0c0c0"
        fontSize="10px"
        fontFamily="Arial"
      >
        {payload.value}%
      </text>
    );
  };

  // Find the maximum value in the data
  const maxValue = Math.max(...initialData.map((d) => d.value));
  const maxVisibleValue = Math.round(maxValue) + 2;
  const ticksYArray = Array.from({ length: maxVisibleValue }, (_, i) => i);

  return (
    <div className="w-full max-w-6xl p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={toggleGroupSort}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sort Groups {groupSortOrder === "asc" ? "↑" : "↓"}
          <ArrowUpDown className="w-4 h-4" />
        </button>
        <button
          onClick={toggleItemSort}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Sort Items {itemSortOrder === "asc" ? "↑" : "↓"}
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full min-w-full mt-8 h-96 ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid
              horizontal={true} // Enable horizontal lines
              vertical={false} // Disable vertical lines
              stroke="#cccccc" // Set the color of the lines
              strokeDasharray="0 0" // Set the style of the lines (dashed lines)
            />
            <XAxis
              axisLine={false}
              dataKey="label"
              interval={0}
              tick={(props) => (
                <CustomXAxisTick {...props} payload={chartData} />
              )}
              tickLine={false}
              height={60}
            />
            <YAxis
              tick={<CustomYAxisTick />} // Use the custom tick component
              ticks={ticksYArray} // Custom tick points
              tickLine={false} // Disable tick lines
              tickFormatter={(tick) => `${tick}%`} // Format tick labels as percentages
              axisLine={false}
              domain={[0, maxVisibleValue]}
              label={<CustomYAxisLabel value="Interest Rates (APR)" />}
            />
            <Tooltip
              /* The grey area you see when mouse over to show the tooltip is called cursor */
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (
                  active &&
                  payload &&
                  payload.length &&
                  !payload[0].payload.isSeparator
                ) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-white border rounded shadow">
                      <p className="font-bold">{data.label}</p>
                      <p>Group: {data.group}</p>
                      <p>Interest: {data.value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* To customize the legend in a BarChart from recharts, 
            you can use the content property of the Legend component
             to provide a custom legend renderer.
              This allows you to fully control the appearance and behavior of the legend */}
            <Legend content={<CustomLegend />} />
            <Bar
              barSize={10}
              dataKey="value"
              name="Interest Rate"
              shape={<CustomBar />}
              isAnimationActive={false} // Disable animation
              isActive={false} // Disable active state
            />
            {chartData.map((item, index) =>
              item.isSeparator ? (
                <ReferenceLine
                  key={`separator-${index}`}
                  x={item.label}
                  stroke="#ccc"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              ) : null
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GroupedChartDemo;
