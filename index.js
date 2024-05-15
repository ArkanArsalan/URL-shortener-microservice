import express from 'express';
import cors from 'cors';
import { URL } from 'url';
import dns from 'dns';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import Url from './models/urls.js';

// Basic Configuration
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// Setup Database and Port
const PORT = process.env.PORT || 5000;
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
      res.status(404).json({ error: err.message })
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

app.get("/api/shorturl/:shortUrlParam", async (req, res) => {
  const { shortUrlParam } = req.params;
  const isUrlFound = await Url.findOne({ shorturl: shortUrlParam });

  if (isUrlFound) {
    res.redirect(isUrlFound.original_url);
  } else {
    res.status(404);
  }
})

