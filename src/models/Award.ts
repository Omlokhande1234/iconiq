import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAward extends Document {
  title: string;
  slug: string;
  category?: string;
  year?: number;

  shortDescription?: string;
  content: string;

awardImage?: {
  url: string;
  publicId: string;
};

awardIcon?: {
  url: string;
  publicId: string;
};

  recognitionCriteria?: string;

  publicationDate?: Date;

  tags: mongoose.Types.ObjectId[];

  status: "draft" | "published";
  featuredOnHomepage: boolean;
  displayOrder: number;

  seoTitle?: string;
  seoDescription?: string;
  socialImage?: {
   url: string;
  publicId: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const AwardSchema = new Schema<IAward>(
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
      type: String,
      trim: true,
    },

    year: {
      type: Number,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    awardImage: {
      url: { type: String },
      publicId: { type: String },
    },

    awardIcon: {
      url: { type: String },
      publicId: { type: String },
    },

    recognitionCriteria: {
      type: String,
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
      url: { type: String },
      publicId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Award: Model<IAward> =
  mongoose.models.Award || mongoose.model<IAward>("Award", AwardSchema);

export default Award;