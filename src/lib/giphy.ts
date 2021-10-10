type GiphyResponse = {
  data: {
    image_url: string;
  };
};

const fallbackGiphyUrl =
  'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif';

export async function fetchRandomUrl(searchTerm: string): Promise<string> {
  try {
    const rating = 'pg';
    const apiKey = 'CHANGEME';
    const tag = searchTerm
      .split(' ')
      .map((word) => encodeURIComponent(word))
      .join('+');
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${tag}&rating=${rating}`,
    );
    const { data }: GiphyResponse = await response.json();
    return data.image_url;
  } catch (err) {
    return fallbackGiphyUrl;
  }
}
