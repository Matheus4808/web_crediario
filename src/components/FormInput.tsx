import { LucideIcon, Check, AlertCircle } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  touched?: boolean;
  isValid?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon: Icon, error, touched, isValid, className, ...props }, ref) => {
    const showError = touched && error;
    const showSuccess = touched && isValid && !error;

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "form-input-base",
              Icon && "pl-10",
              showError && "form-input-error",
              showSuccess && "form-input-success",
              "pr-10",
              className
            )}
            {...props}
          />
          {showError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {showSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <Check className="w-4 h-4" />
            </div>
          )}
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

FormInput.displayName = "FormInput";

export default FormInput;
