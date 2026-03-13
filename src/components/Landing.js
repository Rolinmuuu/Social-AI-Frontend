import React, { useState, useEffect } from "react";

import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import OpenAI from "openai";

import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { BASE_URL, TOKEN_KEY } from "../constants";
import axios from "axios";
import { message } from "antd";
import { CircularProgress } from "@mui/material";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const MainContainer = styled.div`
  background-color: #27272a;
  height: 100%;
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: column;
  align-items: center;
`;

function Landing(props) {
  const [index, setIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState();
  const [slicedPhotos, setSlicedPhotos] = useState();

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (Boolean(generatedImageUrl)) {
      setSlicedPhotos([
        {
          src: generatedImageUrl,
          width: 200,
          height: 200,
        },
      ]);
    }
  }, [generatedImageUrl]);

  const createImage = async () => {
    try {
      setIsGeneratingImage(true);
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: inputValue,
        n: 1,
        size: "1024x1024",
      });
      const imageUrl = response.data[0].url;
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      message.error("Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUploadImage = async () => {
    try {
      const fetchResponse = await fetch(
        generatedImageUrl.replace(/https:\/\/[^/]+/, "/api")
      );
      const blob = await fetchResponse.blob();
      const file = new File([blob], "image.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("message", "AI Generated Image");
      formData.append("message_file", file);

      const uploadResponse = await axios({
        method: "POST",
        url: `${BASE_URL}/upload`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
        data: formData,
      });

      if (uploadResponse.status === 200) {
        message.success("Image uploaded successfully");
      } else {
        message.error("Failed to upload image");
      }
    } catch (error) {
      message.error("Failed to upload image");
    } finally {
      setIndex(-1);
    }
  };

  return (
    <MainContainer>
      {isGeneratingImage && (
        <Overlay>
          <CircularProgress color="info" size={100} />
        </Overlay>
      )}
      <HeaderContainer>
        <Typography
          variant="h1"
          fontSize="5.2rem"
          marginTop="128px"
          noWrap
          component="div"
          sx={{
            fontFamily: "Roboto",
            color: "white",
            textDecoration: "none",
          }}
        >
          Social AI
        </Typography>

        <Typography
          variant="h5"
          fontSize="1.2rem"
          component="div"
          sx={{
            mr: 2,
            fontFamily: "Roboto",
            color: "white",
            textDecoration: "none",
            margin: "0 20px",
            textAlign: "center",
          }}
        >
          Unleash Creativity, Share Memories—Where AI Meets Your Imagination!
        </Typography>

        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: "80%",
            maxWidth: "600px",
            borderRadius: "10px",
            marginTop: "32px",
            marginBottom: "64px",
          }}
        >
          <InputBase
            multiline
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter a detailed description of the photo you want to create..."
            inputProps={{ "aria-label": "search" }}
            value={inputValue}
            onChange={handleInputChange}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            onClick={() => createImage()}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Paper>
      </HeaderContainer>
      <PhotoAlbum
        photos={slicedPhotos}
        layout="rows"
        onClick={({ index }) => setIndex(index)}
      />
      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slicedPhotos}
        toolbar={{
          buttons: [
            <IconButton
              key="upload"
              type="button"
              sx={{ p: "10px" }}
              onClick={() => handleUploadImage()}
            >
              <FileUploadRoundedIcon sx={{ color: "white" }} />
            </IconButton>,
          ],
        }}
      />
    </MainContainer>
  );
}

export default Landing;
