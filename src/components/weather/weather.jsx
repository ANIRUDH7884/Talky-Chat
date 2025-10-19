import React, { useState, useEffect } from "react";
import './weather.css'

import Cloudy from "../../Assets/cloudy.png";
import Drizzle from "../../Assets/drizzle.png";
import Fog from "../../Assets/fog.png";
import Rain from "../../Assets/rainy-day.png";
import Snow from "../../Assets/snow.png";
import Sunny from "../../Assets/sunny.png";
import Thunder from "../../Assets/thunder.png";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const weatherIcons = {
    clear: Sunny,
    clouds: Cloudy,
    rain: Rain,
    thunderstorm: Thunder,
    snow: Snow,
    mist: Fog,
    drizzle: Drizzle,
  };

  const getWeatherIcon = (description) => {
    description = description.toLowerCase();
    if (description.includes("cloud")) return weatherIcons.clouds;
    if (description.includes("rain")) return weatherIcons.rain;
    if (description.includes("thunder")) return weatherIcons.thunderstorm;
    if (description.includes("snow")) return weatherIcons.snow;
    if (description.includes("mist") || description.includes("fog"))
      return weatherIcons.mist;
    if (description.includes("drizzle")) return weatherIcons.drizzle;
    return weatherIcons.clear;
  };

  const getBackgroundGradient = (weatherType) => {
    const gradients = {
      clear: "linear-gradient(135deg, #ff9a00, #ff2400)",
      clouds: "linear-gradient(135deg, #636fa4, #a8c0ff)",
      rain: "linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)",
      thunderstorm: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      snow: "linear-gradient(135deg, #8e9eab, #eef2f3)",
      mist: "linear-gradient(135deg, #606c88, #3f4c6b)",
      drizzle: "linear-gradient(135deg, #89f7fe, #66a6ff)",
    };
    return gradients[weatherType] || gradients.clear;
  };

  const handleWeather = async () => {
    if (!city) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeather({
          weather: data.weather[0].description,
          temp: data.main.temp,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
          feelsLike: data.main.feels_like,
          name: data.name,
          country: data.sys.country,
          main: data.weather[0].main.toLowerCase()
        });

        const resForcast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        const dataForecast = await resForcast.json();
        const dailyForecast = [];
        const map = {};
        dataForecast.list.forEach((item) => {
          const date = item.dt_txt.split(" ")[0];
          if (!map[date]) {
            map[date] = true;
            dailyForecast.push({
              date,
              temp: item.main.temp,
              weather: item.weather[0].description,
              main: item.weather[0].main.toLowerCase()
            });
          }
        });

        setForecast(dailyForecast);
      } else {
        alert("City Not Found");
        setWeather(null);
        setForecast([]);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCity("");
    setWeather(null);
    setForecast([]);
    setActiveTab("today");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleWeather();
    }
  };

  // Auto-focus on input
  useEffect(() => {
    const input = document.querySelector('.search-input');
    if (input) input.focus();
  }, []);

  return (
    <div 
      className="weather-app-v2" 
      style={{ background: weather ? getBackgroundGradient(weather.main) : 'linear-gradient(135deg, #667eea, #764ba2)' }}
    >
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1 className="logo">
            <span className="logo-icon">⛅</span>
            Anko Weather
          </h1>
          <div className="search-container">
            <div className="search-box">
              <input
                type="text"
                className="search-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a city..."
              />
              <button 
                className="search-btn" 
                onClick={handleWeather}
                disabled={loading}
              >
                {loading ? (
                  <div className="loader"></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
            <button className="reset-btn" onClick={handleReset}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H10C6.22876 2 4.34315 2 3.17157 3.17157C2 4.34315 2 6.22876 2 10V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14V10" stroke="currentColor" strokeWidth="2"/>
                <path d="M2.5 2.5L7 7M22 2L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          {weather ? (
            <>
              {/* Current Weather */}
              <section className="current-weather-section">
                <div className="location">
                  <h2 className="city-name">{weather.name}</h2>
                  <span className="country">{weather.country}</span>
                </div>
                
                <div className="weather-display">
                  <div className="temperature-section">
                    <div className="current-temp">{Math.round(weather.temp)}°</div>
                    <div className="weather-description">{weather.weather}</div>
                    <div className="feels-like">Feels like {Math.round(weather.feelsLike)}°</div>
                  </div>
                  
                  <div className="weather-icon-container">
                    <img 
                      src={getWeatherIcon(weather.weather)} 
                      alt={weather.weather} 
                      className="weather-icon-large" 
                    />
                  </div>
                </div>

                {/* Weather Stats */}
                <div className="weather-stats">
                  <div className="stat-card">
                    <div className="stat-icon">💧</div>
                    <div className="stat-info">
                      <div className="stat-value">{weather.humidity}%</div>
                      <div className="stat-label">Humidity</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">💨</div>
                    <div className="stat-info">
                      <div className="stat-value">{weather.windSpeed} m/s</div>
                      <div className="stat-label">Wind Speed</div>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                      <div className="stat-value">{weather.pressure} hPa</div>
                      <div className="stat-label">Pressure</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Forecast Section */}
              <section className="forecast-section">
                <div className="section-tabs">
                  <button 
                    className={`tab ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                  >
                    Today
                  </button>
                  <button 
                    className={`tab ${activeTab === 'week' ? 'active' : ''}`}
                    onClick={() => setActiveTab('week')}
                  >
                    5-Day Forecast
                  </button>
                </div>

                <div className="forecast-content">
                  {activeTab === 'today' ? (
                    <div className="hourly-forecast">
                      <div className="scroll-container">
                        {forecast.slice(0, 8).map((f, index) => (
                          <div key={index} className="hourly-card">
                            <div className="hour-time">
                              {index === 0 ? 'Now' : `${index * 3}:00`}
                            </div>
                            <img 
                              src={getWeatherIcon(f.weather)} 
                              alt={f.weather} 
                              className="hour-icon" 
                            />
                            <div className="hour-temp">{Math.round(f.temp)}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="weekly-forecast">
                      {forecast.slice(0, 5).map((f, index) => (
                        <div key={index} className="daily-card">
                          <div className="day-info">
                            <div className="day-name">
                              {new Date(f.date).toLocaleDateString('en-US', { weekday: 'long' })}
                            </div>
                            <div className="day-date">
                              {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <div className="day-weather">
                            <img 
                              src={getWeatherIcon(f.weather)} 
                              alt={f.weather} 
                              className="day-icon" 
                            />
                            <div className="day-desc">{f.weather}</div>
                          </div>
                          <div className="day-temp">{Math.round(f.temp)}°</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            /* Welcome/Empty State */
            <div className="welcome-section">
              <div className="welcome-content">
                <div className="welcome-icon">🌤️</div>
                <h2>Discover Weather Anywhere</h2>
                <p>Search for a city to get current weather conditions and forecast</p>
                <div className="feature-cards">
                  <div className="feature-card">
                    <div className="feature-icon">🔍</div>
                    <h4>Search Cities</h4>
                    <p>Find weather for any location worldwide</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h4>Live Updates</h4>
                    <p>Real-time weather data and forecasts</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🌡️</div>
                    <h4>Detailed Info</h4>
                    <p>Temperature, humidity, wind and more</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Weather;