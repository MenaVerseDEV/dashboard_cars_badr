interface Step {
  number: number;
  label?: string;
}

interface VerticalStepperProps {
  steps: Step[];
  activeStep: number;
  className?: string;
}

export default function VerticalFormStepper({
  steps,
  activeStep,
  className = "",
}: VerticalStepperProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-col items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step.number <= activeStep
                ? "bg-primary text-primary-foreground"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.number}
          </div>
          {step.label && (
            <span
              className={`mt-1 text-sm text-center ${
                step.number <= activeStep ? "text-primary" : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
          )}
          {index < steps.length - 1 && (
            <div
              className={`my-1 h-16 w-0.5 ${
                step.number <= activeStep - 1 ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
