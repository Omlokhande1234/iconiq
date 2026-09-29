import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;

  description?: string;

  icon?: ICloudinaryImage;
  coverImage?: ICloudinaryImage;

  content?: string;

  status: "active" | "inactive";

  featured: boolean;

  displayOrder: number;

  seoTitle?: string;
  seoDescription?: string;

  socialImage?: ICloudinaryImage;

  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    icon: {
      type: CloudinaryImageSchema,
    },

    coverImage: {
      type: CloudinaryImageSchema,
    },

    content: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    seoTitle: {
      type: String,
      trim: true,
    },

    seoDescription: {
      type: String,
      trim: true,
    },

    socialImage: {
      type: CloudinaryImageSchema,
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>(
    "Category",
    CategorySchema
  );

export default Category;