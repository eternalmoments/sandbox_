import QRCode from 'qrcode.react';

interface Props {
  pixCode: string;
  amount: number;
}

export default function PixPayment({ pixCode, amount }: Props) {
  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
  };

  return (
    <div className="text-center space-y-6">
      <div className="bg-white p-4 rounded-lg inline-block">
        <QRCode value={pixCode} size={200} />
      </div>
      
      <div className="space-y-2">
        <p className="text-white text-lg">Valor: R$ {(amount / 100).toFixed(2)}</p>
        <button
          onClick={copyPixCode}
          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50"
        >
          Copiar código PIX
        </button>
      </div>

      <div className="text-gray-400 text-sm">
        <p>1. Abra o app do seu banco</p>
        <p>2. Escolha pagar via PIX com QR Code</p>
        <p>3. Escaneie o código acima</p>
        <p>4. Confirme o pagamento</p>
      </div>
    </div>
  );
}