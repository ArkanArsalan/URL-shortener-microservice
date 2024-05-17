import express from 'express';
import cors from 'cors';
import { URL } from 'url';
import dns from 'dns';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import Url from './models/Urls.js';

// Basic Configuration
const app = express();
const port = 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// Setup Database and Port
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGGODB_LINK)
  .catch((err) => {
    console.log(`${err} did not connect`);
  })


app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// API endpoint
app.post("/api/shorturl/", (req, res) => {
  const { url } = req.body;

  const urlObj = new URL(url);
  dns.lookup(urlObj.hostname, async (err, address, family) => {
    if (err) {
      res.json({ "error": "invalid url" })
    } else {
      const found = await Url.findOne({ original_url: url });

      if (found) {
        res.json(
          {
            original_url: url,
            shorturl: found.shorturl
          }
        )
      } else {
        const totalDocument = await Url.countDocuments();

        const newUrl = new Url(
          {
            original_url: url,
            shorturl: totalDocument
          }
        )

        const savedUrl = await newUrl.save();

        res.json(
          {
            original_url: url,
            shorturl: savedUrl.shorturl
          }
        )
      }
    }
  });

});

app.get("/api/shorturl/:short_url", async (req, res) => {
  console.log(req.params);
  const shortUrlParam = req.params.short_url;
  const isUrlFound = await Url.findOne({ shorturl: shortUrlParam });

  if (isUrlFound !== null) {
    res.redirect(isUrlFound.original_url);
  } else {
    res.status(404);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

