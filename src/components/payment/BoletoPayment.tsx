interface Props {
  boletoUrl: string;
  boletoNumber: string;
  amount: number;
  expirationDate: string;
}

export default function BoletoPayment({ boletoUrl, boletoNumber, amount, expirationDate }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-400">Valor:</p>
            <p className="text-white text-lg">R$ {(amount / 100).toFixed(2)}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Vencimento:</p>
            <p className="text-white">{expirationDate}</p>
          </div>
          
          <div>
            <p className="text-gray-400">Código do Boleto:</p>
            <p className="text-white break-all font-mono">{boletoNumber}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <a
          href={boletoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg text-center"
        >
          Visualizar Boleto
        </a>
        
        <button
          onClick={() => navigator.clipboard.writeText(boletoNumber)}
          className="px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50"
        >
          Copiar Código
        </button>
      </div>

      <div className="text-gray-400 text-sm space-y-1">
        <p>1. O boleto vence em 3 dias úteis</p>
        <p>2. Após o pagamento, pode levar até 3 dias úteis para compensar</p>
        <p>3. O acesso será liberado assim que o pagamento for confirmado</p>
      </div>
    </div>
  );
}