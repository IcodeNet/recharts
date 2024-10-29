import "./App.css";
import GroupedChartDemo from "./GroupChart";

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
  return (
    <div>
      <GroupedChartDemo
        groupColors={groupColors}
        initialData={initialData}
        legend={"Fitch ratings"}
        sublegend={"Lower to higher risk"}
      />
    </div>
  );
}

export default App;
