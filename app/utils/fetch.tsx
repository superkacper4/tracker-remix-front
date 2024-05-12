const API_URL = "http://localhost:4000/";

export const getData = async (route: string) => {
  const data = await fetch(`${API_URL}${route}`)
    .then((res) => res.json())
    .catch((err) => console.error(err));

  return data;
};
