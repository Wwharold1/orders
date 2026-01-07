declare const window: any;
/**
 *
 * @param event: event name to google tag manager
 * @param uuid : event unique transaction id
 */
export const sendGMT = (event: string, uuid: undefined | string) => {
  if (uuid) {
    window.dataLayer.push({
      event, // Nombre del evento
      userId: uuid, // ID único generado
      timestamp: new Date().toISOString(),
    });
  }
};
