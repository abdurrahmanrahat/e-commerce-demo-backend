import { Types } from 'mongoose';

export type TCategory = {
  name: string;
  slug: string;
  image?: string;
  subCategoryOf?: Types.ObjectId;
};

export type TPromiseResponseCategories = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  subCategories: TPromiseResponseCategory[];
};

export type TPromiseResponseCategory = {
  _id: string;
  name: string;
  slug: string;
};
