import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface INews extends Document {
  title: string;
  slug: string;
  category?: mongoose.Types.ObjectId;

  excerpt?: string;
  content: string;

  featuredImage?: ICloudinaryImage;
  additionalImages: ICloudinaryImage[];

  authorName?: string;
  authorDesignation?: string;
  readingTime?: string;

  publicationDate?: Date;

  tags: mongoose.Types.ObjectId[];

  status: "draft" | "published";
  featuredOnHomepage: boolean;
  displayOrder: number;

  seoTitle?: string;
  seoDescription?: string;
  socialImage?: ICloudinaryImage;

  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema =
  new Schema<ICloudinaryImage>(
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

const NewsSchema = new Schema<INews>(
  {
    title: {
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

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    excerpt: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    featuredImage: {
      type: CloudinaryImageSchema,
    },

    additionalImages: {
      type: [CloudinaryImageSchema],
      default: [],
    },

    authorName: {
      type: String,
      trim: true,
    },

    authorDesignation: {
      type: String,
      trim: true,
    },

    readingTime: {
      type: String,
      trim: true,
    },

    publicationDate: {
      type: Date,
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featuredOnHomepage: {
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

const News: Model<INews> =
  mongoose.models.News ||
  mongoose.model<INews>("News", NewsSchema);

export default News;