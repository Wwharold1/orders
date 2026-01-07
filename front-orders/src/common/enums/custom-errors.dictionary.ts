export const LoginErrorsDictionary = {
  USER_HAS_NO_ROLES: '100001_USAPLOG_NORL',
  USER_BLOQUED: '100002_USAPLOG_BLQ',
  USER_CREDENTIALS: '100003_USAPLOG_USRC',
  NOT_REGISTERED: '100004_USAPLOG_NTRG',
  NOT_VERIFIED: '100005_USAPLOG_NTVR',
  USER_DISABLED: '100006_USAPLOG_DSBL',
  LIMIT_INTENTS: '100007_USAPLOG_LMTI',
  CREDENTIALS_INCORRECT: '100008_USAPLOG_CRIN',
};

export const RegisterEmailErrorsDictionary = {
  ALREADY_REGISTER: 'User Already registered',
};

export const VerifyAccountErrorsDictionary = {
  EMAIL_NOT_EXIST: '100011_USAPVFA_NEX',
  HASH_BEEN_USED: '100012_USAPVFA_HBU',
  HASH_NOT_VALID: '100013_USAPVFA_HNV',
  ACCOUNT_EXIST: '100014_USAPVFA_AEX',
  HASH_ERROR: '100015_USAPVFA_HER',
};

export const SendCodeRecoveryErrorsDictionary = {
  EMAIL_NOT_EXIST: '100021_USAPSRP_NEX',
  LIMIT_SHIPMENTS: '100022_USAPSRP_LMS',
};

export const ValidateRecoverErrorsDictionary = {
  CODE_INVALID: '100031_USAPVRP_CIV',
  CODE_BEEN_USED: '100032_USAPVRP_CBU',
  CODE_EXPIRED: '100033_USAPVRP_CEX',
  BAD_REQUEST: 'Bad Request',
};

export const SendEmailValdationErrorsDictionary = {
  EMAIL_NOT_EXIST: '100051_USAPSEV_ENE',
  EMAIL_ALREADY_VERIFIED: '100052_USAPSEV_EAV',
  LIMIT_SHIPMENTS: '100053_USAPSEV_LMS',
};

export const SendEmailCreateErrorsDictionary = {
  EMAIL_NOT_EXIST: '100061_USAPSEP_ENE',
  LIMIT_SHIPMENTS: '100062_USAPSEP_LMS',
};

export const VerifyCodeEmailErrorsDictionary = {
  NOT_MATCH: 'Security Code No match',
};

export const PasswordRegistrationErrorsDictionary = {
  PHONE_EXIST: 'Phone number exist',
};

export const CreatePasswordErrorsDictionary = {
  EMAIL_NOT_EXIST: '100071_USAPCPW_ENE',
  ACCOUNT_EXIST: '100072_USAPCPW_ACE',
  PASSWORD_MISMATCH: '100073_USAPCPW_PMM',
  HASH_ERROR: '100074_USAPCPW_HER',
};

export const VerifyEmailHashErrorsDictionary = {
  EMAIL_NOT_EXIST: '100081_USAPVEH_ENE',
  ACCOUNT_EXIST: '100082_USAPVEH_ACE',
  EMAIL_ALREADY_VERIFIED: '100083_USAPVEH_EAV',
  HASH_ERROR: '100085_USAPVFA_HER',
};

export const UpdateEmailCustomerErrorsDictionary = {
  EMAIL_EXIST: '100091_USAPUEC_EEX',
  EMAIL_ALREADY_VERIFIED: '100092_USAPUEC_EAV',
  NOT_IN_SPECTRUM: '100093_USAPUEC_NIS',
  NOT_MATCHING_SPECTRUM: '100094_USAPUEC_NMS',
};

export const SearchCollaboratorErrorsDictionary = {
  USER_NOT_FOUND: '100101_USAPSCR_UNF',
  EMAIL_ALREADY_VERIFIED: '100102_USAPSCR_EAV',
  LIMIT_SHIPMENTS: '100103_USAPSCR_LMS',
  USER_NO_FUNDS: '100104_USAPSCR_UNS',
};

/* NATURAL CLIENT ERRORS */

export const IdentifyCustomerErrorsDictionary = {
  DOCUMENT_NUMBER_EXIST: 'Number document exist',
};

export const PersonalInformationErrorsDictionary = {
  NOT_LEGAL_USER: 'User is not legal year',
};

export const AMLRequestErrorsDictionary = {
  ALREADY_PASSED_AML: 'Already passed AML',
};

export const IdentityValidationErrorsDictionary = {
  LIMIT_SHIPMENTS: 'you have exceeded the limit shipments',
  VERIFICATION_FAILED: 'Verification Failed',
  MISMATCH: 'mismatching names with document',
};

export const FacephiIdentityValidationErrorsDictionary = {
  POSITIVE: 'Positive',
  NEGATIVE: 'Negative',
};

export enum CivilMessages {
  'NONE' = 'No se pudo realizar la comprobación facial.',
  'NEGATIVE' = 'La comparación del patrón facial de las caras no coincide.',
  'POSITIVE' = 'Exitoso',
  'NON EBECAUSE POSE EXCEED' = 'No se pudo realizar la comprobación facial debido a la pose del rostro.',
  'NONE BECAUSE INVALID EXTRACTIONS' = 'No se pudo realizar la comprobación facial por problemas en la extracción del patrón facial.',
}

/* INVESTMENT ERRORS */

export const CreateSubscriptionErrorsDictionary = {
  FAILURE: 'No se pudo crear suscripción. Comuníquese con su asesor',
};

/* BANK ACCOUNTS ERRORS */
export const CreateAccountErrorsDictionary = {
  ACCOUNT_NUMBER_EXISTS: 'This bank account is already exist',
  CCI_EXISTS: 'This cci is already exist',
};

/* RESCUE ERRORS */
export const CreateRescueErrorsDictionary = {
  ONLY_ONE_RESCUE_PER_DAY: "You can't make a new rescue in less than 24 hours",
  MINIMUN_AMOUNT: 'The minimum amount to rescue is',
  MINIMUN_AMOUNT_PERMANENCE: 'minimum amount to remain',
  ALREADY_RESCUED: "You can't make a new rescue in less than 24 hours",
};

/* PROFILE ERRORS */
export const ValidateEmailErrorsDictionary = {
  SAME_AS_THE_OLD: "New email can't be the same as the current one",
  ALREADY_REGISTERED: 'Email Already registered',
};
export const ValidatePhoneErrorsDictionary = {
  SAME_AS_THE_OLD: "New phone number can't be the same as the current one",
  ALREADY_REGISTERED: 'Phone number Already registered',
};
export const UpdateEmailErrorsDictionary = {
  INVALID_CODE: 'Security Code No match',
};
export const UpdatePhoneErrorsDictionary = {
  INVALID_CODE: 'Security Code No match',
};
export const DownloadEECCErrorsDictionary = {
  NOT_FOUND: 'EECC Not Found',
};
