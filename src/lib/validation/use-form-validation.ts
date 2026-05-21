"use client";

import { useCallback, useState } from "react";
import type { ZodType } from "zod";
import { toast } from "sonner";
import {
  apiErrorFields,
  formDataToRecord,
  parseWithSchema,
  type FieldErrors,
} from "@/lib/validation/parse";

export function useFormValidation() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearErrors = useCallback(() => setFieldErrors({}), []);

  const validate = useCallback(<T,>(schema: ZodType<T>, data: unknown): T | null => {
    const result = parseWithSchema(schema, data);
    if (result.ok) {
      setFieldErrors({});
      return result.data;
    }
    setFieldErrors(result.errors);
    toast.error(result.message);
    return null;
  }, []);

  const validateFormData = useCallback(
    <T,>(schema: ZodType<T>, form: FormData): T | null => {
      return validate(schema, formDataToRecord(form));
    },
    [validate],
  );

  const applyApiErrors = useCallback((err: unknown): boolean => {
    const fields = apiErrorFields(err);
    if (!fields) return false;
    setFieldErrors(fields);
    return true;
  }, []);

  const handleApiError = useCallback(
    (err: unknown): boolean => {
      if (!applyApiErrors(err)) return false;
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Please fix the errors below.";
      toast.error(message);
      return true;
    },
    [applyApiErrors],
  );

  return {
    fieldErrors,
    setFieldErrors,
    clearErrors,
    validate,
    validateFormData,
    applyApiErrors,
    handleApiError,
  };
}
