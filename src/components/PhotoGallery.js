import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  maxHeight: "240px",
  overflow: "hidden",
  position: "absolute",
  bottom: "0",
  width: "100%",
  color: "white",
  padding: "2px",
  fontSize: "90%",
};

const wrapperStyle = {
  display: "block",
  minHeight: "1px",
  width: "100%",
  border: "1px solid #ddd",
  overflow: "auto",
};

const PhotoGallery = (props) => {
  const [images, setImages] = useState(props.images);
  const [index, setIndex] = useState(-1);

  const imageArr = images.map((image) => {
    return {
      ...image,
      width: 200,
      height: 200,
      customOverlay: (
        <div style={captionStyle}>
          <div>{`${image.user} ${image.caption}`}</div>
          <Button
            style={{ marginTop: "10px", marginLeft: "5px" }}
            key="deleteImage"
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteImage(image.postId)}
          >
            {" "}
            Delete Image
          </Button>
        </div>
      ),
    };
  });
  const onDeleteImage = (postId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const newImages = images.filter((image) => {
        return image.postId !== postId;
      });
      const options = {
        method: "DELETE",
        url: `${BASE_URL}/post/${postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      };
      axios(options)
        .then((response) => {
          if (response.status === 200) {
            setImages(newImages);
          } else {
            message.error("Failed to delete image");
          }
        })
        .catch(() => {
          message.error("Failed to delete image, try again later");
        });
    }
  };
  useEffect(() => {
    setImages(props.images);
  }, [props.images]);

  const updateImages = ({ index }) => {
    setIndex(index);
  };

  return (
    <div style={wrapperStyle}>
      <PhotoAlbum
        layout="rows"
        photos={imageArr}
        targetRowHeight={200}
        onClick={updateImages}
      />
      <Lightbox
        slides={imageArr}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        on={{
          view: updateImages,
        }}
        toolbar={{
          buttons: [
            <IconButton
              key="delete"
              type="button"
              sx={{ p: "10px" }}
              onClick={() => onDeleteImage(imageArr[index]?.postId)}
            >
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>,
          ],
        }}
      />
    </div>
  );
};

PhotoGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      postId: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      thumbnailWidth: PropTypes.number.isRequired,
      thumbnailHeight: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default PhotoGallery;
