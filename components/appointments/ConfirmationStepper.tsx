import { FC } from "react";
import { Step } from "./AppointmentConfirmationModal";

type VerticalStepperProps = {
  steps: Step[];
  currentStep: number;
};

const ConfirmationStepper: FC<VerticalStepperProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex flex-col py-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div
            key={index}
            className={`flex flex-col items-start ${
              isActive ? "text-primary" : "text-[#DEE7EC]"
            }`}
          >
            <div className="flex flex-col items-center mr-4">
              <div className={`flex h-[34px] items-center gap-x-3`}>
                <span>{step.icon}</span>
                <span className="text-[12px] md:text-[14px]">{step.label}</span>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex flex-col items-center py-2 pl-1 gap-1">
                <div
                  className={`border ${
                    isActive ? "border-primary" : "border-[#DEE7EC]"
                  } h-[6px] w-[6px] rounded-full`}
                />

                <div
                  className={`w-px h-8 border-l border-dashed ${
                    isActive ? "border-primary" : "border-[#DEE7EC]"
                  }`}
                />

                <div
                  className={`border ${
                    isActive ? "border-primary" : "border-[#DEE7EC]"
                  } h-[6px] w-[6px] rounded-full`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConfirmationStepper;
