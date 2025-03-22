import { FieldPath, FieldValues, useFormContext } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/components/ui/form';
import { Input } from '@/shadcn/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';

interface HookFormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  description?: React.ReactNode;
  placeholder?: string;
  readOnly?: boolean;
}

export const HookFormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: HookFormInputProps<TFieldValues, TName>,
) => {
  const { name, label, description, placeholder, readOnly } = props;
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} readOnly={readOnly} />
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

interface HookFormNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends HookFormInputProps<TFieldValues, TName> {
  min?: number;
  max?: number;
}

export const HookFormNumber = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: HookFormNumberProps<TFieldValues, TName>,
) => {
  const { name, label, description, placeholder, min, max } = props;
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="number" placeholder={placeholder} {...field} min={min} max={max} />
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

interface HookFormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  label: string;
  description?: React.ReactNode;
  placeholder?: string;
  children: React.ReactNode;
}

export const HookFormSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: HookFormSelectProps<TFieldValues, TName>,
) => {
  const { name, label, description, placeholder, children } = props;
  const form = useFormContext<TFieldValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const { onChange, onBlur, ref, ...rest } = field;
        return (
          <FormItem className="w-full">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select onValueChange={onChange} {...rest}>
                <SelectTrigger className="w-full" onBlur={onBlur} ref={ref}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>{children}</SelectContent>
              </Select>
            </FormControl>
            {description && <FormDescription className="text-xs">{description}</FormDescription>}
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
};

const HookForm = Object.assign(Form, {
  Input: HookFormInput,
  Number: HookFormNumber,
  Select: HookFormSelect,
  SelectItem: SelectItem,
});

export default HookForm;
