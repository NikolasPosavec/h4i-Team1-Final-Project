import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { CarsXE } from "carsxe-api";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
if (getApps().length === 0) {
  let serviceAccount = null;

  // Try to load from service account key file first
  const keyFilePath = "./serviceAccountKey.json";

  if (existsSync(keyFilePath)) {
    try {
      serviceAccount = JSON.parse(readFileSync(keyFilePath, "utf8"));
      console.log("Loaded Firebase service account from file");
    } catch (error) {
      console.error("Error reading service account key file:", error.message);
    }
  }

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

// CarsXE API configuration
const CARSXE_API_KEY = process.env.CARSXE_API_KEY;
const carsxe = new CarsXE(CARSXE_API_KEY);

// Read cars.json
const carsData = JSON.parse(readFileSync("./cars.json", "utf8"));

// Function to query CarsXE API
async function getCarSpecs(year, make, model, color) {
  const params = {
    year: String(year),
    make: make,
    model: model,
    color: color,
  };

  try {
    const ymm = await carsxe.yearMakeModel(params);
    return ymm;
  } catch (error) {
    console.error(`  Error fetching specs: ${error.message}`);
    return null;
  }
}

async function getCarImage(year, make, model, color) {
  const params = {
    year: String(year),
    make: make,
    model: model,
    color: color,
    size: "Large",
  };

  try {
    const images = await carsxe.images(params);
    return images;
  } catch (error) {
    console.error(`  Error fetching images: ${error.message}`);
    return null;
  }
}

// Function to extract and format car data
function extractCarData(car, apiData, imageData) {
  // Generate random mileage between 5,000 and 150,000
  const mileage = Math.floor(Math.random() * (150 - 5 + 1) + 5) * 1000;

  const specs = apiData.bestMatch;

  return {
    make: car.make,
    model: car.model,
    year: car.year,
    trim: specs.name || "",
    color: specs.color.exterior[0].name || "",
    price: specs.base_msrp || 0,
    mileage: mileage,
    seats: specs.total_seating || 0,
    drivetrain: specs.features.standard[5].features[1].value || "",
    image_url: imageData?.images[0].link || "",
  };
}

// Main function to populate Firestore
async function populateFirestore() {
  console.log(
    `Starting to populate Firestore with ${carsData.length} cars...\n`
  );

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < carsData.length; i++) {
    const car = carsData[i];
    console.log(
      `Processing ${i + 1}/${carsData.length}: ${car.year} ${car.make} ${
        car.model
      }...`
    );

    try {
      // Query CarsXE API
      const apiData = await getCarSpecs(
        car.year,
        car.make,
        car.model,
        car.color
      );

      if (!apiData) {
        console.log(`No API data found, using basic info`);
        errorCount++;
      }

      const imageData = await getCarImage(
        car.year,
        car.make,
        car.model,
        car.color
      );

      // Extract car data
      const carData = extractCarData(car, apiData, imageData);

      // Add to Firestore
      await db.collection("cars").add(carData);
      console.log(`Added to Firestore`);
      successCount++;

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(
        `Error processing ${car.year} ${car.make} ${car.model}:`,
        error.message
      );
      errorCount++;
    }
  }

  console.log(`\n Population complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
}

// Run the script
populateFirestore()
  .then(() => {
    console.log("\nScript completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nScript failed:", error);
    process.exit(1);
  });
