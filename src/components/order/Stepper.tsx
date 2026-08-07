import { getStepList, stepLabels, type StepId } from '@/lib/orders/checkoutReducer';

interface StepperProps {
  currentStepIndex: number;
}

export function Stepper({ currentStepIndex }: StepperProps) {
  const steps = getStepList();

  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold" aria-label="Progreso del pedido">
      {steps.map((stepId: StepId, index) => {
        const isCurrent = index === currentStepIndex;
        const isDone = index < currentStepIndex;
        return (
          <li key={stepId} className="flex items-center gap-2">
            <span
              aria-current={isCurrent ? 'step' : undefined}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                isCurrent
                  ? 'bg-brand-blue text-brand-white'
                  : isDone
                    ? 'bg-brand-beige text-brand-blue'
                    : 'bg-brand-cream text-brand-black/40'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  isCurrent ? 'bg-brand-white text-brand-blue' : 'bg-brand-blue/20'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>
              {stepLabels[stepId]}
            </span>
            {index < steps.length - 1 ? <span aria-hidden="true" className="text-brand-black/20">›</span> : null}
          </li>
        );
      })}
    </ol>
  );
}
