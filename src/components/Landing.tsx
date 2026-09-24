import React, { useState } from "react";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { message, Card, Image, Button } from "antd";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import type { Post } from "../types/model";

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
  flex-direction: column;
  align-items: center;
`;

const ResultContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 16px 64px;
`;

function Landing() {
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!inputValue.trim()) {
      message.warning("Please enter a description");
      return;
    }
    setIsGenerating(true);
    setGeneratedPost(null);
    try {
      const response = await axios.post<Post>(
        `${BASE_URL}/post/generate-image-from-openai`,
        { prompt: inputValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        setGeneratedPost(response.data);
        message.success("Image generated and published!");
      }
    } catch {
      message.error("Failed to generate image, please try again");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainContainer>
      {isGenerating && (
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
          sx={{ fontFamily: "Roboto", color: "white" }}
        >
          Social AI
        </Typography>

        <Typography
          variant="h5"
          fontSize="1.2rem"
          component="div"
          sx={{
            fontFamily: "Roboto",
            color: "white",
            margin: "0 20px",
            textAlign: "center",
          }}
        >
          Unleash Creativity, Share Memories—Where AI Meets Your Imagination!
        </Typography>

        <Paper
          component="form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            handleGenerate();
          }}
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
            inputProps={{ "aria-label": "prompt" }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px" }} disabled={isGenerating}>
            <ArrowForwardIcon />
          </IconButton>
        </Paper>
      </HeaderContainer>

      {generatedPost && (
        <ResultContainer>
          <Card
            style={{ maxWidth: 600, width: "100%", borderRadius: 12 }}
            cover={
              <Image
                alt={generatedPost.message}
                src={generatedPost.url}
                style={{ maxHeight: 512, objectFit: "contain" }}
              />
            }
            actions={[
              <Button
                key="collection"
                type="link"
                onClick={() => navigate("/collection")}
              >
                View in Collection
              </Button>,
              <Button
                key="new"
                type="link"
                onClick={() => {
                  setGeneratedPost(null);
                  setInputValue("");
                }}
              >
                Generate Another
              </Button>,
            ]}
          >
            <Card.Meta
              title="AI Generated Image"
              description={generatedPost.message}
            />
          </Card>
        </ResultContainer>
      )}
    </MainContainer>
  );
}

export default Landing;
