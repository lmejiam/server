const handleUpload = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadedFiles = req.files.map(file => ({
            originalName: file.originalname,
            savedAs: file.filename,
            size: file.size,
            path: file.path,
        }));

        res.status(200).json({
            message: "Files uploaded successfully",
            files: uploadedFiles,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
};

export { handleUpload };