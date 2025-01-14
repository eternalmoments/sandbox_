import { useState } from 'react';
import InputField from './InputField';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function CpfInput({ value, onChange, error }: Props) {
  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      onChange(formatted);
    }
  };

  return (
    <InputField
      label="CPF"
      type="text"
      id="cpf"
      value={value}
      onChange={handleChange}
      placeholder="000.000.000-00"
      error={error}
      required
    />
  );
}