import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api/axios.js';

export const useStartFlow = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleStartFlow = async (flowCode) => {
        if (!isAuthenticated) {
            alert('Por favor inicia sesión para usar esta opción.');
            navigate('/login');
            return;
        }

        try {
            const { data: checkData } = await api.get('/chat/session/check');
            if (checkData.hasActive) {
                const confirm = window.confirm("Tienes una sesión de chat activa. Si continúas, se reemplazará por esta nueva solicitud. ¿Deseas continuar?");
                if (!confirm) return;
            }

            const { data: sessionData } = await api.post('/chat/session/flow', { flow: flowCode });
            window.dispatchEvent(new CustomEvent('open-chat', { detail: { sessionId: sessionData.sessionId } }));
        } catch (error) {
            console.error('Error starting flow:', error);
            alert('Hubo un error al iniciar el proceso.');
        }
    };

    return { handleStartFlow };
};
