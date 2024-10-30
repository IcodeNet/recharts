import { useEffect, useState } from "react";
import "./App.css";
import GroupedChartDemo from "./GroupChart";

import { deposits } from "./ref-data/deposits";

const initialData = [
  { group: "a++", label: "a", value: 2.6 },
  { group: "a++", label: "b", value: 1.4 },
  { group: "a++", label: "c", value: 3.2 },
  { group: "a++", label: "d", value: 2.6 },
  { group: "a++", label: "e", value: 1.4 },
  { group: "a++", label: "f", value: 3.2 },
  { group: "a+", label: "g", value: 2 },
  { group: "a+", label: "h", value: 4.3 },
  { group: "a+", label: "i", value: 2 },
  { group: "a+", label: "j", value: 1.3 },
  { group: "a+", label: "k", value: 2 },
  { group: "a+", label: "l", value: 1.3 },
  { group: "a+", label: "m", value: 3 },
  { group: "a+", label: "n", value: 1.3 },
  { group: "a+", label: "o", value: 2 },
  { group: "a+", label: "p", value: 1.3 },
  { group: "a+", label: "q", value: 2 },
  { group: "a+", label: "r", value: 1.3 },
  { group: "a+", label: "s", value: 2 },
  { group: "a", label: "t", value: 1.3 },
  { group: "a", label: "u", value: 2 },
  { group: "a", label: "v", value: 1.3 },
  { group: "a", label: "w", value: 2 },
  { group: "a", label: "x", value: 1.3 },
  { group: "a", label: "y", value: 2 },
  { group: "a", label: "z", value: 1.3 },
  { group: "a-", label: "f", value: 2.6 },
  { group: "a-", label: "g", value: 3.4 },
  { group: "a-", label: "h", value: 4.1 },
  { group: "a-", label: "f", value: 2.6 },
  { group: "a-", label: "g", value: 3.4 },
  { group: "a-", label: "h", value: 4.1 },
];

const groupColors = {
  "a++": "#8884d8",
  "a+": "#868686",
  a: "#82ca9d",
  "a-": "#ffc658",
};

function App() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Process the JSON data to extract the required fields
    const processedData = deposits
      .map((item) => ({
        color: item.financialInstitution.inidicationColour,
        name: item.financialInstitution.name,
        group: item.financialInstitution.fitchRating,
        value: item.productIssues[0].ratePercent,
      }))
      .filter((item) => item.value >= 0);
    setChartData(processedData);
  }, []);

  return (
    <div>
      {chartData?.length > 1 && (
        <GroupedChartDemo
          initialData={chartData}
          legend={"Fitch ratings"}
          sublegend={"Lower to higher risk"}
        />
      )}
    </div>
  );
}

export default App;
