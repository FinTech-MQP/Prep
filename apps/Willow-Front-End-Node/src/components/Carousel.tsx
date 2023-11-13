import { CSSProperties, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { WILLOW_COLOR } from "@monorepo/utils";
import styled from "@emotion/styled";

const styles: { [key: string]: CSSProperties } = {
  carouselContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    width: "400px",
    height: "220px",
    borderRadius: "5px",
    cursor: "default",
  },
  carouselImagePseudo: {
    width: "100%",
    height: "220px",
    display: "flex",
    backgroundColor: "#ccc",
  },
  carouselImage: {
    width: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  placeholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "400px",
    height: "220px",
    background: "#f3f3f3",
    color: "#666",
    fontSize: "20px",
    border: "1px solid #ddd",
    position: "absolute",
    top: "0",
    left: "0",
  },
  prevButton: {
    left: "10px",
  },
  nextButton: {
    right: "10px",
  },
};

const NavButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(255, 255, 255, 0.6)",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.8)",
  },
  "& .MuiTouchRipple-root": {
    color: WILLOW_COLOR,
  },
});

interface CarouselProps {
  images: string[] | null;
  onClick: (event: any) => void;
}

const Carousel = ({ images, onClick }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => {
    if (images && images.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
    }
  };

  const goNext = () => {
    if (images && images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  const hasImages = images && images.length > 0;

  return (
    <Box sx={styles.carouselContainer} onClick={onClick}>
      {hasImages ? (
        <Box sx={styles.carouselImagePseudo}>
          <img
            src={images[currentIndex]}
            alt="carousel"
            style={styles.carouselImage}
          />
        </Box>
      ) : (
        <Box sx={styles.placeholder}>No Image Found</Box>
      )}
      <NavButton onClick={goPrev} disabled={!hasImages} sx={styles.prevButton}>
        <ChevronLeftIcon style={{ color: hasImages ? WILLOW_COLOR : "" }} />
      </NavButton>
      <NavButton onClick={goNext} disabled={!hasImages} sx={styles.nextButton}>
        <ChevronRightIcon style={{ color: hasImages ? WILLOW_COLOR : "" }} />
      </NavButton>
    </Box>
  );
};
export default Carousel;
