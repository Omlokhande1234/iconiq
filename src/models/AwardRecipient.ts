import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface ICloudinaryImage {
  url: string;
  publicId: string;
}

export interface IAwardRecipient
  extends Document {
  award: mongoose.Types.ObjectId;

  name: string;
  designation?: string;
  organization?: string;

  photo?: ICloudinaryImage;

  profile?: string;
  slug?: string;

  recipientType:
    | "individual"
    | "organization";

  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const CloudinaryImageSchema =
  new Schema(
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

const AwardRecipientSchema =
  new Schema<IAwardRecipient>(
    {
      // -----------------------------------------
      // Award reference
      // -----------------------------------------

      award: {
        type: Schema.Types.ObjectId,
        ref: "Award",
        required: true,
      },

      // -----------------------------------------
      // Recipient name
      // -----------------------------------------

      name: {
        type: String,
        required: true,
        trim: true,
      },

      // -----------------------------------------
      // Designation
      // -----------------------------------------

      designation: {
        type: String,
        trim: true,
      },

      // -----------------------------------------
      // Organization
      // -----------------------------------------

      organization: {
        type: String,
        trim: true,
      },

      // -----------------------------------------
      // Recipient photo
      // -----------------------------------------

      photo: {
        type: CloudinaryImageSchema,
      },

      // -----------------------------------------
      // Profile URL / path
      // -----------------------------------------

      profile: {
        type: String,
        trim: true,
      },

      // -----------------------------------------
      // Slug
      // -----------------------------------------

      slug: {
        type: String,
        trim: true,
        lowercase: true,
      },

      // -----------------------------------------
      // Recipient type
      // -----------------------------------------

      recipientType: {
        type: String,
        enum: [
          "individual",
          "organization",
        ],
        default: "individual",
      },

      // -----------------------------------------
      // Display order
      // -----------------------------------------

      displayOrder: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const AwardRecipient: Model<IAwardRecipient> =
  mongoose.models.AwardRecipient ||
  mongoose.model<IAwardRecipient>(
    "AwardRecipient",
    AwardRecipientSchema
  );

export default AwardRecipient;