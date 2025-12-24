interface StepperProps {
  steps: string[];
  currentStep: number;
  primaryColor?: string;
}

export default function FormStepper({
  steps,
  currentStep,
  primaryColor = "bg-red-500",
}: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <div
          className={`flex items-center justify-center ${primaryColor} text-white rounded-full w-6 h-6 text-sm font-medium`}
        >
          {currentStep}
        </div>
        <span className="ml-2 font-medium">{steps[currentStep - 1]}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${primaryColor} transition-all duration-300 ease-in-out`}
          style={{
            width: `${(currentStep / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

