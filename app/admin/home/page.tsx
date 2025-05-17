import OverviewTable from "@/components/home/OverviewTable";
import StatCard from "@/components/home/StatCard";

const dummyStats = [
  {
    title: "Total Appointments",
    number: 15,
    netValue: 40,
    profit: true,
  },
  {
    title: "Total Exam booking",
    number: 2,
    netValue: 5,
    profit: false,
  },
  {
    title: "Total Exam booking",
    number: 4,
    netValue: 12,
    profit: true,
  },
  {
    title: "Total Quotations",
    number: 12,
    netValue: 3,
    profit: false,
  },
];

const dummyData = Array(7).fill({
  doctor: "Hamza Naeem",
  date: "1/1/2025",
  purpose: "Regular checkup as usual",
});
const Home = () => {
  return (
    <div className="w-full flex flex-col space-y-8 px-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            number={stat.number}
            netValue={stat.netValue}
            profit={stat.profit}
          />
        ))}
      </div>
      <OverviewTable data={dummyData} />
    </div>
  );
};

export default Home;
