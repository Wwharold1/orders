export enum ContextRoutesEnum {
  LOGIN = '/',

  DASHBOARD = '/dashboard',

  ORDER_CREATE = '/order/create',
  ORDER_UPDATE = '/order/edit',
}

export const listProtectedRoutes = Object.values(ContextRoutesEnum);

export const TopBarRouteName = {
   [ContextRoutesEnum.ORDER_CREATE]: {
    title: 'Nueva orden',
    subtitle: 'Nueva orden',
  },
   [ContextRoutesEnum.ORDER_UPDATE]: {
    title: 'Editar orden',
    subtitle: 'Editar orden',
  },
};
