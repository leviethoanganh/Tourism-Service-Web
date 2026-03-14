module.exports.imagePost = (req, res) => {
    console.log("--- File nhận được từ TinyMCE ---");
    console.log(req.file); // Kiểm tra xem có dữ liệu file không
    
    if (req.file && req.file.path) {
        res.json({ location: req.file.path });
    } else {
        res.status(400).json({ error: "Upload thất bại!" });
    }
};