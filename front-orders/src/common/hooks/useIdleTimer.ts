import { useIdleTimer } from 'react-idle-timer';

import eventEmitter from '@/common/helper/eventEmitterHelper';

const InactivityHandler = () => {
  const handleOnIdle = () => {
    // Emitir un evento personalizado para notificar la inactividad
    eventEmitter.emit('unauthorized', { message: 'Token expired' });
  };
  useIdleTimer({
    timeout: 3 * 60 * 1000, // 10 minutos en milisegundos
    onIdle: handleOnIdle, // Función que se ejecuta cuando está inactivo
    debounce: 500,
  });

  return null; // No es necesario renderizar nada
};

export default InactivityHandler;
