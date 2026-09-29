import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface IHallOfFame extends Document {
  name: string;
  slug: string;
  designation?: string;
  organization?: string;

  profilePhoto?: ICloudinaryImage;
  biography?: string;

  recognitionTitle?: string;
  description?: string;
  content: string;

  additionalImages: ICloudinaryImage[];
  pullQuote?: string;

  yearOfInduction?: number;
  recognitionCategory?: string;

  category?: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];

  publicationDate?: Date;

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

const HallOfFameSchema =
  new Schema<IHallOfFame>(
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

      designation: {
        type: String,
        trim: true,
      },

      organization: {
        type: String,
        trim: true,
      },

      profilePhoto: {
        type: CloudinaryImageSchema,
      },

      biography: {
        type: String,
      },

      recognitionTitle: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      content: {
        type: String,
        required: true,
      },

      additionalImages: {
        type: [CloudinaryImageSchema],
        default: [],
      },

      pullQuote: {
        type: String,
        trim: true,
      },

      yearOfInduction: {
        type: Number,
      },

      recognitionCategory: {
        type: String,
        trim: true,
      },

      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },

      tags: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],

      publicationDate: {
        type: Date,
      },

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

const HallOfFame: Model<IHallOfFame> =
  mongoose.models.HallOfFame ||
  mongoose.model<IHallOfFame>(
    "HallOfFame",
    HallOfFameSchema
  );

export default HallOfFame;