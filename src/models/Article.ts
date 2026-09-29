import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  title: string;
  slug: string;

  category?: mongoose.Types.ObjectId;

  excerpt?: string;
  content: string;

  featuredImage?: {
    url: string;
    publicId: string;
    alt?: string;
  };

  authorName?: string;
  authorDesignation?: string;

  authorPhoto?: {
    url: string;
    publicId: string;
  };

  readingTime?: string;
  publicationDate?: Date;

  tags: mongoose.Types.ObjectId[];

  status: "draft" | "published";

  featuredOnHomepage: boolean;
  displayOrder: number;

  additionalImages: {
    url: string;
    publicId: string;
    alt?: string;
  }[];

  seoTitle?: string;
  seoDescription?: string;

  socialImage?: {
    url: string;
    publicId: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
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
      url: {
        type: String,
      },

      publicId: {
        type: String,
      },

      alt: {
        type: String,
      },
    },

    authorName: {
      type: String,
      trim: true,
    },

    authorDesignation: {
      type: String,
      trim: true,
    },

    authorPhoto: {
      url: {
        type: String,
      },

      publicId: {
        type: String,
      },
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

    additionalImages: {
      type: [
        {
          url: String,
          publicId: String,
          alt: String,
        },
      ],
      default: [],
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
      url: {
        type: String,
      },

      publicId: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Article: Model<IArticle> =
  mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);

export default Article;