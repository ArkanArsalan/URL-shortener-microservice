import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        original_url: String,
        short_url: String
    }
)

const Url = mongoose.model("Urls", urlSchema);

export default Url;