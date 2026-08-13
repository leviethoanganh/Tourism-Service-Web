import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import cloudinary from "../helpers/cloudinary.helper";
import Tour from "../models/tour.model";

const isBase64 = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("data:");

async function migrate() {
  await mongoose.connect(process.env.DATABASE as string);
  console.log("MongoDB connected");

  const tours = await Tour.find({
    $or: [{ avatar: /^data:/ }, { images: /^data:/ }],
  });

  console.log(`Found ${tours.length} tour(s) with base64 images`);

  let migratedTours = 0;
  let migratedImages = 0;
  let failed = 0;

  for (const tour of tours) {
    try {
      let changed = false;

      if (isBase64(tour.avatar)) {
        const uploaded = await cloudinary.uploader.upload(tour.avatar, { folder: "tours" });
        tour.avatar = uploaded.secure_url;
        migratedImages++;
        changed = true;
      }

      if (Array.isArray(tour.images) && tour.images.some(isBase64)) {
        const newImages: string[] = [];
        for (const img of tour.images) {
          if (isBase64(img)) {
            const uploaded = await cloudinary.uploader.upload(img, { folder: "tours" });
            newImages.push(uploaded.secure_url);
            migratedImages++;
          } else {
            newImages.push(img);
          }
        }
        tour.images = newImages;
        changed = true;
      }

      if (changed) {
        await tour.save();
        migratedTours++;
        console.log(`Migrated tour "${tour.name}" (${tour._id})`);
      }
    } catch (err: any) {
      failed++;
      const detail = err?.message || err?.error?.message || JSON.stringify(err);
      console.error(`Failed to migrate tour ${tour._id}:`, detail);
    }
  }

  console.log("---");
  console.log(`Tours migrated: ${migratedTours}`);
  console.log(`Images uploaded to Cloudinary: ${migratedImages}`);
  console.log(`Failures: ${failed}`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
