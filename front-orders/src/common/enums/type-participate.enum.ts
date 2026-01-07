interface ITypeParticipateItem {
  title: string;
  subtitle: string;
  type: TypeParticipateEnum;
}

export enum TypeParticipateEnum {
  NATURAL_PERSON = 'NATURAL_PERSON',
  JURIDIC_PERSON = 'JURIDIC_PERSON',
  MANCOMUNATE = 'MANCOMUNATE',
}

export const ContextTypeParticipate: ITypeParticipateItem[] = [
  {
    title: 'Persona natural',
    subtitle: 'Yo seré el único (a) titular de la inversión.',
    type: TypeParticipateEnum.NATURAL_PERSON,
  },
  {
    title: 'Persona jurídica',
    subtitle:
      'La inversión estará a nombre de una organización, empresa o institución.',
    type: TypeParticipateEnum.JURIDIC_PERSON,
  },
  {
    title: 'Mancomunada',
    subtitle: 'La inversión tendrá más de 1 titular.',
    type: TypeParticipateEnum.MANCOMUNATE,
  },
];
