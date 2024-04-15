import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams hook
import { format, fromUnixTime } from "date-fns";

const WeatherPage = () => {
  const { lat, lon } = useParams();
  const [weatherData, setWeatherData] = useState(null); // Initialize weatherData as null
  const [loading, setLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(false);

  //  handler for changing temp from kelvin to celsius

  const kelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(2);
  };

  // handler toggle function

  const toggleUnitTemp = () => {
    setIsCelsius((prevIsCelsius) => !prevIsCelsius);
  };

  const kelvinTemp = weatherData ? weatherData?.main?.temp : null;
  const temperature = isCelsius ? kelvinToCelsius(kelvinTemp) : kelvinTemp;

  useEffect(() => {
    setLoading(true);
    fetchWeatherData()
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    const apiUrl = `http://localhost:5000/weather/city?lat=${lat}&lon=${lon}`;
    try {
      const response = await axios.get(apiUrl);
      return response.data; // Return response.data directly
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  };
  console.log(weatherData);

  // changing date formate

  return (
    <div className="w-screen flex flex-col mx-auto justify-center items-center min-[792px]:flex-row min-[792px]:gap-8">
      {loading ? (
        <Spin />
      ) : weatherData ? (
        <div className="min-[792px]:flex-row">
          <h2 className="text-2xl mt-3 mb-3 bg-yellow-300 px-2 py-1">
            Weather for city:
            <span className="bg-purple-300 px-2 py-1 mx-2 rounded-lg ">
              {weatherData?.name}
            </span>
            <p className="mb-4 p-2 bg-blue-200 rounded-lg mt-4 text-lg">
              Date: {format(fromUnixTime(weatherData.dt), "MMMM dd, yyyy")}
            </p>
          </h2>
          <Card title="Current Weather " className="bg-blue-100" hoverable>
            <button onClick={toggleUnitTemp} className="bg-green-300">
              Convert temp to {isCelsius ? "Kelvin" : "Celsius"}
            </button>
            <p className="mt-4 p-2">
              Temperature:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {temperature} {isCelsius ? "°C" : "K"}
              </span>
            </p>
            <p className="mt-4 p-2">
              Description:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.weather[0]?.description}
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Humidity:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.main?.humidity}%
              </span>
            </p>
            <p className="mt-4 p-2">
              Wind Speed:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.wind?.speed} m/s
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Pressure:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.main?.pressure} hPa
              </span>
            </p>
          </Card>
          <Card title="Forecast" className="mt-4 bg-blue-100" hoverable>
            <p className="mt-4 p-2">
              Temperature max in Kelvin:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.main?.temp_max}°K
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Temperature max in Celcius:{" "}
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {kelvinToCelsius(weatherData?.main?.temp_max)}°C
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Temperature min in Kelvin:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.main?.temp_min}°K
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Temperature min in Celcius:{" "}
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {kelvinToCelsius(weatherData?.main?.temp_min)}°C
              </span>
            </p>{" "}
            <p className="mt-4 p-2 ">
              Description main:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.weather[0]?.main}
              </span>
            </p>{" "}
            <p className="mt-4 p-2">
              Cloud:
              <span className=" mx-4 p-2 bg-purple-100 rounded-lg">
                {weatherData?.clouds?.all}%
              </span>
            </p>
          </Card>
        </div>
      ) : (
        <p >No weather data available</p>
      )}
    </div>
  );
};

export default WeatherPage;
