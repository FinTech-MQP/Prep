import { Masonry } from "@mui/lab";
import { Button, Modal, Box } from "@mui/material";
import { useState } from "react";

export default function ImageGrid({ images }: { images: string[] | null }) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Box>
      <Masonry columns={3} spacing={1}>
        {images &&
          images.map((image, index) => (
            <Box key={index}>
              <img
                src={image}
                alt={`Image ${index}`}
                style={{ width: "100%" }}
              />
            </Box>
          ))}
      </Masonry>
      <Button onClick={() => setOpen(true)}>See All Images</Button>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedImage(null);
        }}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onClick={() => setSelectedImage(null)}
          />
        ) : (
          <Box>
            {images &&
              images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index}`}
                  style={{ width: "33%", cursor: "pointer" }}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
          </Box>
        )}
      </Modal>
    </Box>
  );
}
