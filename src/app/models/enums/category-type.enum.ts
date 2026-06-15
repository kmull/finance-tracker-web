export enum CategoryType {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HELTH = 'HELTH',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER',

}


export const CategoryDescriptions: Record<CategoryType, string> = {
  [CategoryType.FOOD]: 'Jedzenie',
  [CategoryType.TRANSPORT]: 'Transport',
  [CategoryType.ENTERTAINMENT]: 'Rozrywka',
  [CategoryType.HELTH]: 'Zdrowie',
  [CategoryType.SHOPPING]: 'Zakupy',
  [CategoryType.OTHER]: 'Inne',
}
