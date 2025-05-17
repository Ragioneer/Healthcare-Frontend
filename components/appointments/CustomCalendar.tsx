import { FC, useEffect, useState } from "react";
import "../../app/calendar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SelectableDate {
  date: Date;
  timesAvailable: {
    startTime: Date;
    endTime: Date;
  }[];
}

const selectableDates: SelectableDate[] = [
  {
    date: new Date(2025, 4, 15),
    timesAvailable: [
      {
        startTime: new Date(2025, 4, 15, 2, 0),
        endTime: new Date(2025, 4, 15, 2, 30),
      },
      {
        startTime: new Date(2025, 4, 15, 4, 0),
        endTime: new Date(2025, 4, 15, 4, 30),
      },
    ],
  },
  {
    date: new Date(2025, 4, 17),
    timesAvailable: [
      {
        startTime: new Date(2025, 4, 17, 7, 30),
        endTime: new Date(2025, 4, 17, 8, 0),
      },
      {
        startTime: new Date(2025, 4, 17, 3, 0),
        endTime: new Date(2025, 4, 17, 4, 30),
      },
    ],
  },
  {
    date: new Date(2025, 4, 21),
    timesAvailable: [
      {
        startTime: new Date(2025, 4, 21, 8, 0),
        endTime: new Date(2025, 4, 21, 9, 0),
      },
      {
        startTime: new Date(2025, 4, 21, 5, 30),
        endTime: new Date(2025, 4, 21, 6, 0),
      },
    ],
  },
  {
    date: new Date(2025, 4, 22),
    timesAvailable: [
      {
        startTime: new Date(2025, 4, 22, 8, 30),
        endTime: new Date(2025, 4, 22, 9, 0),
      },
      {
        startTime: new Date(2025, 4, 22, 10, 30),
        endTime: new Date(2025, 4, 22, 11, 0),
      },
    ],
  },
];

const CustomCalendar: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [startDay, setStartDay] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    setDaysInMonth(days);
    setStartDay(new Date(year, month, 1).getDay());
  }, [currentDate]);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const prevMonth = () => {
    const now = new Date();
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);

    if (
      prevMonthDate.getFullYear() < now.getFullYear() ||
      (prevMonthDate.getFullYear() === now.getFullYear() &&
        prevMonthDate.getMonth() < now.getMonth())
    ) {
      return;
    }

    setCurrentDate(prevMonthDate);
  };

  const nextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setCurrentDate(nextMonthDate);
  };

  const handleDateClick = (date: Date) => {
    const isSelectable = selectableDates.some(
      (selectableDate) =>
        selectableDate.date.toDateString() === date.toDateString()
    );

    if (isSelectable) {
      setSelectedDate(date);
    }
  };

  const isDateSelectable = (date: Date) => {
    return selectableDates.some(
      (selectableDate) =>
        selectableDate.date.toDateString() === date.toDateString()
    );
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log("selected date:", selectedDate);

  return (
    <div className={`${selectedDate ? "w-full flex gap-x-4" : "w-full flex"}`}>
      <div className="w-[360px] pb-2.5">
        <div className="flex justify-center items-center gap-2">
          <button
            className={`p-2 rounded-full h-[36px] w-[36px] border text-white hover:bg-white hover:text-primary hover:border-primary transition-colors duration-300 ${
              currentDate.getFullYear() <= new Date().getFullYear() &&
              currentDate.getMonth() <= new Date().getMonth()
                ? "bg-gray-400 cursor-not-allowed border border-gray-400 hover:bg-gray-400 hover:text-white hover:border-gray-400"
                : "bg-primary"
            }`}
            onClick={prevMonth}
            disabled={
              currentDate.getFullYear() <= new Date().getFullYear() &&
              currentDate.getMonth() <= new Date().getMonth()
            }
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-primary w-[150px] text-center text-[16px] md:text-[20px]">
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </span>

          <button
            className="p-2 bg-primary rounded-full h-[36px] w-[36px] border text-white hover:bg-white hover:text-primary hover:border-primary transition-colors duration-300"
            onClick={nextMonth}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="day-names">
          {dayNames.map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>

        <div className="days">
          {Array.from({ length: startDay }).map((_, index) => (
            <div key={index} className="empty-day"></div>
          ))}

          {daysInMonth.map((day, index) => {
            const isSelectable = isDateSelectable(day);
            const isSelected =
              selectedDate &&
              day.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`day 
                ${isSelected ? "selected" : ""}
                ${!isSelectable ? "not-selectable" : "selectable"}
              `}
                onClick={() => isSelectable && handleDateClick(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className={"w-fit pb-2.5 flex flex-col space-y-2"}>
          <h2 className="font-semibold text-[20px] md:text-[24px] text-primary">
            {selectedDate.getDate()}
          </h2>
          {selectableDates
            .find(
              (selectableDate) =>
                selectableDate.date.toDateString() ===
                selectedDate?.toDateString()
            )
            ?.timesAvailable.map((time, index) => {
              return (
                <div key={index} className="flex flex-col items-center gap-x-2">
                  <div className="w-full h-[50px] p-2 rounded-xl border border-primary bg-white text-primary hover:bg-primary hover:text-white transition-colors duration-300 text-[14px] md:text-[16px] font-semibold flex items-center justify-center cursor-pointer">
                    {formatTime(time.startTime)} - {formatTime(time.endTime)}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
