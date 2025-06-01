import * as xlsx from "xlsx";
import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

dotenv.config();

// 1. Configure Sanity client
const client = createClient({
  projectId: "kmhnx1uu",
  dataset: "production",
  token:
    "skdIo5G2MwkqgKInmK3sKl2n8QqSHm8afe9NAEJR3wtz4PoaOpqvfIS8pTJu3u3HGfEmxzvlMoJMgInWaqHJVsGI9meIfSUCD1oL2eL0BIP6hoGqbD7tMaQp6itvn5JH0WO6hWX7CUlYnBu5mW12OtAbK2EyvHoL9c3Ies1ycZbN3zpGLluH",
  apiVersion: "2025-06-01",
  useCdn: false,
});

interface CertificateRow {
  "Serial No": string;
  Name: string;
  District: string;
  "No Of Days": number;
  "Training On": string;
  "Training Institute Name": string;
  "Training Institute Address": string;
  From: string;
  To: string;
  Key: string;
}
// 2. Load Excel
const workbook = xlsx.readFile("certificate.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json<CertificateRow>(sheet);

// 3. Prepare and upload each row
async function upload() {
  for (const row of rows) {
    const safeId = `cert-${row["Serial No"].replace(/[^a-zA-Z0-9_-]/g, "-")}`;

    const doc = {
      _type: "certificates",
      _id: safeId,
      serial: row["Serial No"],
      name: row.Name,
      district: row.District,
      days: row["No Of Days"],
      training: row["Training On"],
      institute: row["Training Institute Name"],
      address: row["Training Institute Address"],
      from: row.From,
      to: row.To,
      key: row.Key,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✅ Uploaded: ${doc.serial}`);
    } catch (err) {
      console.error(`❌ Failed: ${doc.serial}`, err);
    }
  }
}

upload();
