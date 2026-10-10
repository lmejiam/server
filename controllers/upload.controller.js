import { updateActiveTagFile } from "./status.controller.js";


async function handleUpload(req, res) {
    try {
        if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = req.files.map(file => ({
        originalName: file.originalname,
        savedAs: "activetagfile.csv", //file.filename
        size: file.size,
        path: file.path,
        }));

        const row = await updateActiveTagFile(req.files[0].filename);
        if (!row) {
        return res.status(404).json({ error: 'System status row not found' });
        }

        res.json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
        systemStatus: row,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload failed' });
    }
}


export { handleUpload };