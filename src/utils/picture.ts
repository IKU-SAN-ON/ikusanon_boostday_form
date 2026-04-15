export const getRandomRalseiImage = () => {
  const images = [
    "/images/ralsei_beats.png",
    "/images/ralsei_dance.png",
    "/images/ralsei_groove.png",
  ];

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};
