import { FC } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { RxPencil1 } from "react-icons/rx";

type OverviewTableProps = {
  data: {
    doctor: string;
    date: string;
    purpose: string;
  }[];
};
const filters = [
  {
    name: "Url's",
    label: "url",
  },
  {
    name: "Chats",
    label: "chats",
  },
  {
    name: "Files",
    label: "files",
  },
  {
    name: "Quotation",
    label: "quotation",
  },
  {
    name: "Lab Exam",
    label: "lab-exam",
  },
  {
    name: "Receptionist",
    label: "receptionist",
  },
  {
    name: "Appointment",
    label: "appointment",
  },
];

const tableHeader = ["Doctor Name", "Date", "Purpose", "Action"];
const OverviewTable: FC<OverviewTableProps> = ({ data }) => {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="font-medium text-[16px] md:text-[20px] text-black">
          Filter Data
        </h2>
        <div className="flex max-sm:flex-wrap max-sm:gap-y-4 py-2 items-center gap-x-2">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-x-2 h-[40px] rounded-full px-[12px] py-[8px] text-primary cursor-pointer border border-primary hover:bg-primary hover:text-white transition-colors duration-300"
            >
              <p className="text-[12px] md:text-[14px] ">{filter.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full bg-white border rounded-[12px] border-secondary"
        style={{ boxShadow: "0px 1px 2px 0px #0A0D120F" }}
      >
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full min-w-[600px] md:min-w-0">
            <thead className="hidden md:block bg-[#F1FBFF] text-[#242424] font-medium">
              <tr className="text-[10px] md:text-[12px]">
                {tableHeader.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 md:px-6 md:py-3 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50 group">
                  <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-[#242424] text-[12px] md:text-[14px]">
                    {row.doctor}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-[#242424] text-[12px] md:text-[14px]">
                    {row.date}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 md:px-6 md:py-4 text-[#242424] text-[12px] md:text-[14px]">
                    {row.purpose}
                  </td>

                  <td className="md:hidden w-fit p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-[14px]">
                          {row.doctor}
                        </span>
                        <div className="flex gap-2">
                          <button>
                            <FaRegTrashAlt
                              size={18}
                              className="text-[#A4A7AE] hover:text-[#8b8d91]"
                            />
                          </button>
                          <button>
                            <RxPencil1
                              size={18}
                              className="text-[#A4A7AE] hover:text-[#8b8d91]"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="text-[12px] text-gray-500">
                        <p>Date: {row.date}</p>
                        <p>Purpose: {row.purpose}</p>
                      </div>
                    </div>
                  </td>

                  <td className="hidden w-fit md:table-cell px-4 py-3 md:px-6 md:py-4">
                    <div className="flex gap-2 md:gap-4">
                      <button>
                        <FaRegTrashAlt
                          size={20}
                          className="text-[#A4A7AE] hover:text-[#8b8d91]"
                        />
                      </button>
                      <button>
                        <RxPencil1
                          size={20}
                          className="text-[#A4A7AE] hover:text-[#8b8d91]"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 gap-4">
          <button className="order-1 md:order-none flex items-center gap-2 text-[12px] md:text-[14px] font-semibold px-3 py-2 md:px-[14px] md:py-[8px] border border-primary rounded-[8px] text-primary hover:bg-primary hover:text-white w-full md:w-auto justify-center">
            <GoArrowLeft size={18} className="shrink-0" />
            <span>Previous</span>
          </button>

          <div className="order-3 md:order-none flex items-center gap-1 md:gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                className={`w-7 h-7 md:w-8 md:h-8 text-[12px] md:text-[14px] rounded-[8px] font-medium ${
                  i === 0
                    ? "bg-secondary text-primary hover:bg-primary hover:text-white"
                    : "bg-white text-[#717680] hover:bg-secondary hover:text-primary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button className="order-2 md:order-none flex items-center gap-2 text-[12px] md:text-[14px] font-semibold px-3 py-2 md:px-[14px] md:py-[8px] border border-primary rounded-[8px] text-primary hover:bg-primary hover:text-white w-full md:w-auto justify-center">
            <span>Next</span>
            <GoArrowRight size={18} className="shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTable;
