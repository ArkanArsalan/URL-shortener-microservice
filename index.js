import express from 'express';
import cors from 'cors';
import { URL } from 'url';
import dns from 'dns';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Url from './models/Urls.js';
import { nanoid } from 'nanoid';

// Basic Configuration
const app = express();
const port = 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// Setup Database and Port
mongoose
  .connect(process.env.MONGGODB_LINK)
  .then(() => {
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  })
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

      try {
        const found = await Url.findOne({ original_url: url });

        if (found) {
          return res.status(200).json({
            original_url: url,
            short_url: found.short_url
          });
        } else {
          let shortUrlId = 0;

          while (true) {
            shortUrlId = nanoid(5);
            const isShortUrlFound = await Url.findOne({ short_url: shortUrlId });

            if (!isShortUrlFound) {
              break;
            }
          }

          const newUrl = new Url({
            original_url: url,
            short_url: shortUrlId
          });

          const savedUrl = await newUrl.save();

          return res.status(201).json({
            original_url: url,
            short_url: savedUrl.short_url
          });
        }
      } catch (err) {
        return res.status(500).json({ "error": err.message });
      }
    }
  });

});

app.get("/api/shorturl/:short_url", async (req, res) => {
  const shortUrlParam = req.params.short_url;

  try {
    const isUrlFound = await Url.findOne({ short_url: shortUrlParam });

    if (isUrlFound !== null) {
      res.redirect(isUrlFound.original_url);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ "error": err.message });
  }
});

