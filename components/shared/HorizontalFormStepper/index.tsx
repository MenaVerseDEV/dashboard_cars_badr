"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
  isCompleted?: boolean;
  isActive?: boolean;
}

interface HorizontalFormStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function HorizontalFormStepper({
  steps,
  currentStep,
  className,
}: HorizontalFormStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step with text at top */}
            <div className="flex flex-col items-center flex-1">
              {/* Step label at the top */}
              <span
                className={cn("text-sm font-semibold text-center mb-3", {
                  "text-primary": step.isActive || step.isCompleted,
                  "text-gray-400": !step.isActive && !step.isCompleted,
                })}
              >
                {step.label}
              </span>

              {/* Horizontal line below the text */}
              <div
                className={cn("w-full h-1 rounded-xl transition-colors", {
                  "bg-primary": step.isActive || step.isCompleted,
                  "bg-gray-300": !step.isActive && !step.isCompleted,
                })}
              />
            </div>

            {/* Spacer between steps */}
            {index < steps.length - 1 && <div className="w-4" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
