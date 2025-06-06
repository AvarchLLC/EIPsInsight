import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    turquoise: {
      50: "#e0f7fa",
      100: "#b2ebf2",
      200: "#80deea",
      300: "#4dd0e1",
      400: "#26c6da",
      500: "#40E0D0", // Your standard turquoise
      600: "#30c9c9", // Darker for hover
      700: "#1fb8b8", // Even darker for active
      800: "#00838f",
      900: "#006064",
    },
  },
});

export default theme;