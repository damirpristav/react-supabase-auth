import { InputHTMLAttributes } from 'react';
import { useField } from 'formik';

export const Input = ({ label, name, ...props }: Props) => {
  const [field, meta] = useField(name);

  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={field.value}
        onChange={field.onChange}
        type={props.type || 'text'}
        {...props}
      />
      {meta.error && meta.touched && (
        <p className="form-input__error">{meta.error}</p>
      )}
    </div>
  );
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}
