/**
 * Cloudinary Bulk Image Uploader
 * Reads credentials from .env and uploads all files in assets/images/
 * 
 * Usage:
 * 1. Fill your credentials in .env
 * 2. Run: npm install
 * 3. Run: npm run upload-images
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const FOLDER_NAME = process.env.CLOUDINARY_FOLDER || 'epic_portal';

async function uploadFile(filePath, subfolder) {
    const fileName = path.parse(filePath).name;
    const publicId = `${FOLDER_NAME}/${subfolder}/${fileName}`;

    console.log(`Uploading ${filePath} -> ${publicId}...`);
    try {
        const res = await cloudinary.uploader.upload(filePath, {
            public_id: publicId,
            overwrite: true,
            resource_type: 'image'
        });
        console.log(`✓ Uploaded: ${res.secure_url}`);
        return { file: path.basename(filePath), url: res.secure_url };
    } catch (err) {
        console.error(`✗ Error uploading ${filePath}:`, err.message);
        return null;
    }
}

async function scanAndUpload(dir, relativeDir = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const results = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subResults = await scanAndUpload(fullPath, path.join(relativeDir, entry.name));
            results.push(...subResults);
        } else if (/\.(png|jpg|jpeg|svg|webp)$/i.test(entry.name)) {
            const res = await uploadFile(fullPath, relativeDir.replace(/\\/g, '/'));
            if (res) results.push(res);
        }
    }
    return results;
}

(async () => {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name_here') {
        console.error('Please configure your CLOUDINARY_CLOUD_NAME in .env first!');
        process.exit(1);
    }

    console.log('Starting Cloudinary upload for EPIC assets...');
    const uploaded = await scanAndUpload(IMAGES_DIR);
    console.log(`\nSuccessfully uploaded ${uploaded.length} assets to Cloudinary!`);
})();
