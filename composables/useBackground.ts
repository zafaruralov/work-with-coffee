const backgroundImage = [
  {
    id: 1,
    url: "/images/ghibli.webp"
  },
  {
    id: 2,
    url: "/images/ghibli-2.webp"
  },
  {
    id: 3,
    url: "/images/japan-cafe.webp"
  }
];
const fitOptions = ["fit", "fill", "stretch", "tile", "center"] as const;
type FitMode = (typeof fitOptions)[number];

const selectedImage = ref(backgroundImage[0].url);

const selectedFit = ref<FitMode>("fill");

const backgroundStyle = computed(() => {
  const style: Record<string, string> = {
    backgroundImage: `url(${selectedImage.value})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover"
  };

  switch (selectedFit.value) {
    case "fit":
      style.backgroundSize = "contain";
      break;
    case "fill":
      style.backgroundSize = "cover";
      break;
    case "stretch":
      style.backgroundSize = "100% 100%";
      break;
    case "tile":
      style.backgroundRepeat = "repeat";
      style.backgroundSize = "auto";
      break;
    case "center":
      style.backgroundSize = "auto";
      style.backgroundPosition = "center";
      break;
  }
  return style;
});
export const useBackground = () => {
  return {
    selectedImage,
    selectedFit,
    backgroundStyle,
    backgroundImage,
    fitOptions
  };
};
