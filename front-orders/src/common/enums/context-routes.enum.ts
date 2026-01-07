export enum ContextRoutesEnum {
  // AUTH
  LOGIN = '/',

  AUTH_IDENTITY_VALIDATION = '/auth/identity-validation',
  AUTH_GENERATE_PASSWORD = '/auth/generate-password',
  AUTH_REGISTER = '/auth/register',

  // DASHBOARD
  DASHBOARD = '/dashboard',
  DASHBOARD_RISK_PROFILE = '/risk-profile',
  DASHBOARD_RISK_PROFILE_RESULT = '/risk-profile/result',
  PRODUCTS_FUND_DETAIL = '/products/detail',
  PRODUCTS_RECOMMENDED = '/products/recommended',

  // SUBSCRIPTIONS
  SUBSCRIPTION_TYPE_PARTICIPATE = '/subscription/type-participate',
  NATURAL_CLIENT_FORM = '/subscription/natural-client',
  SUBSCRIPTION_INVESTMENT = '/subscription/investment',
  BIOMETRIC_VALIDATION = '/subscription/biometric-validation',

  // ACCOUNTS
  ADD_ACCOUNT = '/accounts/create',
  EDIT_ACCOUNT = '/accounts/edit',

  // RESCUES
  RESCUE_BIOMETRIC_VALIDATION = '/rescue/biometric-validation',
  ADD_RESCUE = '/rescue/create-rescue',

  // PROFILE
  EDIT_PROFILE = '/profile/edit',
  PROFILE_VALIDATE_EMAIL = '/profile/validate-email',
  PROFILE_VALIDATE_PHONE = '/profile/validate-phone',
  PROFILE_UPDATE_PASSWORD = '/profile/update-password',
  PROFILE_DOWNLOAD_EECC = '/profile/download-eecc',
  PROFILE_FINAL_BENEFICIARY = '/profile/final-beneficiary',
  PROFILE_CHANGE_RISK = '/profile/change-risk',
}

export const listProtectedRoutes = Object.values(ContextRoutesEnum);

export const TopBarRouteName = {
  [ContextRoutesEnum.DASHBOARD_RISK_PROFILE]: {
    title: 'Perfil de tolerancia al riesgo',
    subtitle: 'Cuestionario',
  },
  [ContextRoutesEnum.DASHBOARD_RISK_PROFILE_RESULT]: {
    title: 'Perfil de tolerancia al riesgo',
    subtitle: 'Perfil de tolerancia al riesgo',
  },
  [ContextRoutesEnum.PRODUCTS_FUND_DETAIL]: {
    title: 'Detalle del fondo',
    subtitle: 'Productos/Detalle',
  },
  [ContextRoutesEnum.PRODUCTS_RECOMMENDED]: {
    title: 'Nuestros productos',
    subtitle: 'Productos',
  },
  [ContextRoutesEnum.SUBSCRIPTION_TYPE_PARTICIPATE]: {
    title: 'Tipo de partícipe',
    subtitle: 'Tipo de partícipe',
  },
  [ContextRoutesEnum.NATURAL_CLIENT_FORM]: {
    title: 'Datos del cliente',
    subtitle: 'Tipo de partícipe/Datos del cliente',
  },
  [ContextRoutesEnum.SUBSCRIPTION_INVESTMENT]: {
    title: 'Nueva inversión',
    subtitle: 'Nueva inversión',
  },
  [ContextRoutesEnum.BIOMETRIC_VALIDATION]: {
    title: 'Nueva inversión',
    subtitle: 'Nueva inversión',
  },
  [ContextRoutesEnum.ADD_ACCOUNT]: {
    title: 'Nueva cuenta',
    subtitle: 'Nueva cuenta',
  },
  [ContextRoutesEnum.EDIT_ACCOUNT]: {
    title: 'Editar cuenta',
    subtitle: 'Editar cuenta',
  },
  [ContextRoutesEnum.RESCUE_BIOMETRIC_VALIDATION]: {
    title: 'Nuevo rescate',
    subtitle: 'Nuevo rescate',
  },
  [ContextRoutesEnum.ADD_RESCUE]: {
    title: 'Nuevo rescate',
    subtitle: 'Nuevo rescate',
  },
  [ContextRoutesEnum.EDIT_PROFILE]: {
    title: 'Editar perfil',
    subtitle: 'Editar perfil',
  },
  [ContextRoutesEnum.PROFILE_VALIDATE_EMAIL]: {
    title: 'Verificar correo',
    subtitle: 'Editar perfil/Verificar correo',
  },
  [ContextRoutesEnum.PROFILE_VALIDATE_PHONE]: {
    title: 'Verificar celular',
    subtitle: 'Editar perfil/Verificar celular',
  },
  [ContextRoutesEnum.PROFILE_UPDATE_PASSWORD]: {
    title: 'Cambiar contraseña',
    subtitle: 'Editar perfil/Cambiar contraseña',
  },
  [ContextRoutesEnum.PROFILE_DOWNLOAD_EECC]: {
    title: 'Estado de Cuenta',
    subtitle: 'Editar perfil/Estado de Cuenta',
  },
  [ContextRoutesEnum.PROFILE_FINAL_BENEFICIARY]: {
    title: 'Beneficiario final',
    subtitle: 'Beneficiario final',
  },
  [ContextRoutesEnum.PROFILE_CHANGE_RISK]: {
    title: 'Cambiar perfil de tolerancia al riesgo',
    subtitle: 'Editar perfil/Cambiar perfil de tolerancia al riesgo',
  },
};
