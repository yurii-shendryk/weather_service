const got = require("got");
// const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config(); // використовуємо для отримання даних з файлу .env

// app.use(cors());

const PORT = process.env.PORT || 8081;
const thirdPartyBaseUrl = "http://api.weatherbit.io/v2.0/current";
const thirdPartyApiKey = process.env.WEATHER_API_KEY;

app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query; // query параметри, які беремо з  url

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "latitude and longitude are mandatory" });
    }

    const { body } = await got(thirdPartyBaseUrl, {
      searchParams: {
        // query параметри, використовуємо широту і довготу
        key: thirdPartyApiKey,
        lat,
        lon,
      },
      responseType: "json", // перетворюємо отримані дані в джейсон
    });
    const [weatherData] = body.data;
    const {
      city_name,
      temp,
      weather: { description },
    } = weatherData;
    res.json({
      city_name,
      temp,
      description,
    }); // надсилаємо у відповідь об'єкт з даними
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, (err) => {
  if (err) console.log("Error at aserver launch", err);
  console.log(`Server run at port ${PORT}`);
});
