import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITag extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tag =
  mongoose.models.Tag ||
  mongoose.model<ITag>("Tag", TagSchema);

export default Tag;