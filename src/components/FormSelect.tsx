import { LucideIcon, Check, AlertCircle, ChevronDown } from "lucide-react";
import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  touched?: boolean;
  isValid?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, icon: Icon, error, touched, isValid, options, placeholder, className, ...props }, ref) => {
    const showError = touched && error;
    const showSuccess = touched && isValid && !error;

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              "form-input-base appearance-none cursor-pointer",
              Icon && "pl-10",
              showError && "form-input-error",
              showSuccess && "form-input-success",
              "pr-10",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
            {showError && <AlertCircle className="w-4 h-4 text-destructive" />}
            {showSuccess && <Check className="w-4 h-4 text-success" />}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        {showError && (
          <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
