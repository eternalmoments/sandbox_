import { useState } from 'react';
import InputField from '../forms/InputField';
import CpfInput from '../forms/CpfInput';

interface Props {
  onSubmit: (data: any) => Promise<void>;
}

export default function CreditCardForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    cpf: '',
    installments: '1'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        label="Número do Cartão"
        type="text"
        id="cardNumber"
        value={formData.cardNumber}
        onChange={e => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
        placeholder="0000 0000 0000 0000"
        required
      />
      
      <InputField
        label="Nome no Cartão"
        type="text"
        id="cardName"
        value={formData.cardName}
        onChange={e => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
        placeholder="Como está impresso no cartão"
        required
      />
      
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Validade"
          type="text"
          id="expiry"
          value={formData.expiry}
          onChange={e => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
          placeholder="MM/AA"
          required
        />
        
        <InputField
          label="CVV"
          type="text"
          id="cvv"
          value={formData.cvv}
          onChange={e => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
          placeholder="123"
          required
        />
      </div>

      <CpfInput
        value={formData.cpf}
        onChange={(value) => setFormData(prev => ({ ...prev, cpf: value }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Parcelas
        </label>
        <select
          value={formData.installments}
          onChange={e => setFormData(prev => ({ ...prev, installments: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
        >
          <option value="1">1x de R$ 29,99</option>
          <option value="2">2x de R$ 15,00</option>
          <option value="3">3x de R$ 10,00</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg"
      >
        Finalizar Pagamento
      </button>
    </form>
  );
}