import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = "tblYk7P8Qv6RoMfpr"; // Leads Table

const CSV_PATH = "C:\\Users\\tkedd\\Downloads\\neath_port_talbot_plumbers.csv";

async function importPlumbers() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`CSV file not found at ${CSV_PATH}`);
        return;
    }

    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    // Map headers to indices
    const hMap = {};
    headers.forEach((h, i) => hMap[h] = i);

    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Naive CSV split
        const cols = line.split(',');
        if (cols.length < 2) continue;

        const trade = cols[hMap['Trade Category']]?.trim();
        const businessName = cols[hMap['Business Name']]?.trim();
        const town = cols[hMap['Town']]?.trim();
        const url = cols[hMap['Website URL']]?.trim();
        const phone = cols[hMap['Phone Number']]?.trim();
        const notes = cols[hMap['Notes']]?.trim();

        const fields = {
            "Business Name": businessName,
            "Town": town || "",
            "Website URL": url || "",
            "Phone": phone || "",
            "Notes": notes || ""
        };

        // Trade is a singleSelect, we'll try to include it but be prepared for failures
        // if the option doesn't exist and we lack permissions.
        if (trade) fields["Trade"] = trade;

        records.push({ fields });
    }

    console.log(`Importing ${records.length} records...`);

    // Airtable allows batching up to 10 records per request
    for (let i = 0; i < records.length; i += 10) {
        const batch = records.slice(i, i + 10);
        try {
            const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ records: batch })
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(`Error importing batch starting at ${i}:`, err);
            } else {
                console.log(`Successfully imported batch starting at ${i}`);
            }
        } catch (err) {
            console.error(`Network error at batch ${i}:`, err);
        }
    }
}

importPlumbers();
