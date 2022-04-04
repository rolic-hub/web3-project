import { useEffect, useState } from "react";

const API_KEY = process.env.REACT_GIPHY_API;
const url = "https://giphy.p.rapidapi.com/v1/gifs/search";
//

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Host": "giphy.p.rapidapi.com",
    "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
  },
};

const useFetch = ({keyword}) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://giphy.p.rapidapi.com/v1/gifs/search?api_key=${
          process.env.REACT_APP_GIPHY_API
        }&q=${keyword.split("").join("")}&limit=1`,
        options
      );

      const data  = await response.json();
      console.log(data.data);
      setGifUrl(data.data[0]?.images?.downsized_medium.url);
    } catch (error) {
      setGifUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
