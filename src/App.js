import React, { useState, useEffect } from "react";
import Header from "./component/Header"; 

const accessKey = "0d94f3bacc5e483887336cd509bb1e1e";
const openCageKey = "00bc5c1d2a1cdb0deeadc7a642ae9e3b";
const BASE_URL = "https://api.opencagedata.com/geocode/v1/json";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [defaultCities, setDefaultCities] = useState([]); // Состояние для базовых городов
  const [cityWeather, setCityWeather] = useState([]); // Состояние для погоды в базовых городах

  useEffect(() => {
    // Получение данных о текущем местоположении
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Получаем данные о городе по координатам
          const response = await fetch(
            `${BASE_URL}?q=${latitude},${longitude}&key=${accessKey}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            const city = data.results[0].formatted;
            getWeather(city);
          }
        } catch (error) {
          console.error("Ошибка получения местоположения:", error);
        }
      });
    } else {
      console.error("Geolocation не поддерживается браузером.");
    }

    // Загружаем базовую погоду для 5 городов
    const defaultCitiesList = ["Moscow", "London", "New York", "Paris", "Tokyo"]; // Список базовых городов
    setDefaultCities(defaultCitiesList);
    loadDefaultWeather(defaultCitiesList);
  }, []);

  const loadDefaultWeather = async (cities) => {
    try {
      const weatherPromises = cities.map(async (city) => {
        const response = await fetch(`${weatherUrl}?q=${city}&appid=${openCageKey}&units=metric`);
        if (!response.ok) {
          throw new Error(`Ошибка запроса к OpenWeatherMap: ${response.status}`);
        }
        const data = await response.json();
        return { city, data }; // Возвращаем город и данные о погоде
      });
      const weatherData = await Promise.all(weatherPromises);
      setCityWeather(weatherData);
    } catch (error) {
      console.error("Ошибка получения данных о погоде:", error);
    }
  };

  const getWeather = async (city) => {
    try {
      const response = await fetch(
        `${weatherUrl}?q=${city}&appid=${openCageKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeatherData(data);
      updateBackground(data); 
    } catch (error) {
      console.error("Ошибка получения данных о погоде:", error);
    }
  };

  const getForecast = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openCageKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.error("Ошибка получения прогноза погоды:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${BASE_URL}?q=${query}&key=${accessKey}`);
      const data = await response.json();
      if (data.results.length > 0) {
        const city = data.results[0].formatted;
        getWeather(city);
        getForecast(city);
      }
    } catch (error) {
      console.error("Ошибка поиска города:", error);
    }
  };

  
  const updateBackground = (weatherData) => {
    if (weatherData) {
      const weatherMain = weatherData.weather[0].main;
      if (weatherMain.includes("Thunderstorm")) { 
        setBackgroundStyle({
          backgroundColor: "#222",
          backgroundImage:
            "linear-gradient(to bottom, #222, #333, #222)",
          animation: "lightning 1s linear infinite",
        });
      } else if (weatherMain === "Clouds" || weatherMain === "overcast clouds") {
        
        setBackgroundStyle({
          backgroundColor: "#9385df", 
          backgroundImage: "none",
        });
      } else {
        setBackgroundStyle({}); 
      }
    }
  };

  

  return (
    <div className="app" > 
      <Header onSearch={handleSearch} /> 

      
      
      <div className="container" style={backgroundStyle}>
        {weatherData && (
          <div className="weather-info">
            <h1>{weatherData.name}</h1>
            <p>Температура: {weatherData.main.temp} °C</p>
            <p>Описание: {weatherData.weather[0].description}</p>
            
          </div>
        )}
        
        {cityWeather.map((item) => (
          <div key={item.city} className="city-weather">
            <h2>{item.city}</h2>
            <p>Температура: {item.data.main.temp} °C</p>
            <p>Описание: {item.data.weather[0].description}</p>
          </div>
        ))}

        {forecastData && (
          <div className="forecast-info">
            <h2>Прогноз на 5 дней</h2>
            <ul>
              {forecastData.list.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <h3>{new Date(item.dt * 1000).toLocaleDateString()}</h3>
                  <p>Температура: {item.main.temp} °C</p>
                  <p>Описание: {item.weather[0].description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
    </div>
  );
}
export default App