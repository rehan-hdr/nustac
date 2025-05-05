// server.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; 
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import kyber from 'crystals-kyber';
import crypto from "crypto";

// import {api} from "../iam/convexApi1746129877579.ts"


const CONVEX_URL = process.env.CONVEX_URL; // add in your .env.local  
const CONVEX_PATH = "queryData:getUserById"; // change if you named it differently
const keyPair = kyber.KeyGen512();
const publicKey = keyPair[0];
const privateKey = keyPair[1];



const app = express();
const port = 3000;

app.use(cors()); 
// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.json());

// Your Convex API details
// const CONVEX_URL = process.env.CONVEX_URL; // add in your .env.local
const QUERY_FUNCTION = "queryData:getUserByEmail"; // change if you named it differently


function encryptAES256(plainObject, key) {
    // Turn the plain JS object into a JSON string
    const plainText = JSON.stringify(plainObject);
  
    // Make sure the key is 32 bytes (256 bits)
    const aesKey = crypto.createHash('sha256').update(key).digest();
  
    // Generate a random Initialization Vector (IV)
    const iv = crypto.randomBytes(12); // 96-bit IV for AES-GCM
  
    // Create Cipher
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
  
    // Encrypt
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    // Get the authentication tag (for verifying data integrity)
    const authTag = cipher.getAuthTag();
  
    return {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      ciphertext: encrypted
    };
  }

  function decryptAES256(encryptedData, key) {
    const { iv, authTag, ciphertext } = encryptedData;
    const aesKey = crypto.createHash("sha256").update(key).digest();
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      aesKey,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(authTag, "hex"));
    let decrypted = decipher.update(ciphertext, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  }

  app.post("/decrypt", async(req, res) => {
    try {
      const { key, Data, location } = req.body;
      const encapsulatedKey = key;
      const encryptedData = Data;

      console.log(req.body);
  
      if (!encapsulatedKey || !encryptedData) {
        return res
          .status(400)
          .json({ error: "Encapsulated key and encrypted data are required." });
      }
  
      // 1. Recover the symmetric key
      const symmetricKey = kyber.Decrypt512(
        Buffer.from(encapsulatedKey, 'base64'),
        privateKey
      );
      console.log("Decrypted symmetric key:", symmetricKey.toString("hex"));
  
      // 2. Decrypt AES data
      const decryptedData = decryptAES256(encryptedData, symmetricKey);

      const { id, timestamp } = decryptedData;

      if (!id || !timestamp) {
        return res.status(400).json({ error: "Invalid QR payload." });
      }

          // 3. Check timestamp validity (5 min window)
    const createdAt = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();

    if (diffMs > 5 * 60 * 1000) {
      return res.status(403).json({ status: "QR code expired. Entry Denied." });
    }

        // 4. Query Convex using ID
        const response = await fetch(`${CONVEX_URL}/api/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "queryData:getUserById", // You'll add this
            args: { id },
            format: "json",
          }),
        });

        const userData = await response.json();
        console.log("Fetched user from Convex:", userData);
        if (!userData || !userData.value || !userData.value._id) {
          return res.status(404).json({ error: "User not found in database" });
        }

        const allowedLocations = userData.value.Access || [];

        const status = allowedLocations.includes(location)
        ? "Entry Granted"
        : "Access Denied. Invalid Location.";
      
      // Log access attempt to Convex
      await fetch(`${CONVEX_URL}/api/mutation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: "logAccess:logAccess",
          args: {
            userId: userData.value._id,
            name: userData.value.Name,
            email: userData.value.Email,
            location,
            status,
          },
          format: "json",
        }),
      });
      
      // Now send final response
      if (status === "Entry Granted") {
        return res.json({ status });
      } else {
        return res.status(403).json({ status });
      }
      
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Decryption or validation failed" });
      }
  });
  
  

// API endpoint to encrypt the data
app.post("/encrypt", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "email is required." });
    }

    // Step 1: Fetch user by email to get ID and details
    const response = await fetch(`${CONVEX_URL}/api/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "queryData:getUserByEmail",
        args: { email },
        format: "json",
      }),
    });

    const userData = await response.json();
    if (!userData) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const id = userData.value._id;

    console.log("User Data: ", userData);
    const plainText = {
      id,
      timestamp: new Date().toISOString(),
      };
   console.log("Plain Text: ", plainText);
    // Generate symmetric key and ciphertext
    const c_ss = kyber.Encrypt512(publicKey);
    const c = c_ss[0]; // ciphertext (encapsulated)
    const ss1 = c_ss[1]; // symmetric key

    console.log("Symmetric key used (ss1):", ss1.toString("hex"));

    // Encrypt the plainText using AES and ss1
    const encryptedData = encryptAES256(plainText, ss1);

    res.json({ encapsulatedKey:Buffer.from(c).toString('base64'), encryptedData,username: userData.value.Name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Encryption failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Encryption server running at http://localhost:${port}`);
});
