import { useNavigate } from 'react-router-dom';

export default function DeletePlanPage() {
  const navigate = useNavigate();

  const handleCancelClick = () => {
    alert("Plano cancelado");
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-gray-400 mb-4 text-center">Cancelamento de Plano</h2>
        <p className="text-gray-300 mb-6 text-center">
          Você está prestes a cancelar seu plano. Ao confirmar o cancelamento:
        </p>
        <ul className="text-gray-300 mb-6 list-disc pl-5">
          <li>Você perderá a capacidade de criar novos sites.</li>
          <li>Seu site será retirado do ar e não será mais acessível.</li>
          <li>Não forneceremos mais manutenção ou atualizações para o seu site.</li>
          <li>Para voltar a ter acesso ao seu site, será necessário assinar o plano novamente.</li>
        </ul>
        <p className="text-red-500 font-bold mb-6 text-center">
          Importante: Ao cancelar, todos os dados e informações do seu site serão perdidos permanentemente.
        </p>

        <p className="text-lg text-gray-300 mb-4 text-center">Tem certeza que deseja cancelar?</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md"
          >
            Voltar
          </button>

          <button
            onClick={handleCancelClick}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
          >
            Cancelar Plano
          </button>
        </div>
      </div>
    </div>
  );
}
