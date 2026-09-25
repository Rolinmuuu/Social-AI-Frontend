import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Button, Image, Input } from "antd";
import { ThunderboltOutlined, ReloadOutlined, CompassOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL, TOKEN_KEY } from "../constants";
import type { Post } from "../types/model";

const EXAMPLES = [
  "A lighthouse on a cliff at golden hour, watercolor",
  "Isometric tiny coffee shop with plants, soft pastel 3D",
  "A fox reading a book under a paper lantern, warm storybook style",
];

function Landing() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<Post | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.warning("Describe the image you want first");
      return;
    }
    setIsGenerating(true);
    setGeneratedPost(null);
    try {
      const response = await axios.post<Post>(
        `${BASE_URL}/post/generate-image-from-openai`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        setGeneratedPost(response.data);
        message.success("Image generated and published");
      }
    } catch {
      message.error("Image generation failed, please try again");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="page create-page">
      <section className="create-hero">
        <p className="eyebrow">Create with AI</p>
        <h1>
          Turn an idea into a <span className="grad-text">post</span>.
        </h1>
        <p className="lead">Describe a picture. DALL·E 3 draws it, and it is published to your collection right away.</p>

        <form
          className="prompt-card"
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
        >
          <Input.TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 5 }}
            placeholder="A detailed description of the image you want to create…"
            aria-label="Image prompt"
            variant="borderless"
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <div className="prompt-foot">
            <div className="chips">
              {EXAMPLES.map((ex) => (
                <button type="button" key={ex} className="chip" onClick={() => setPrompt(ex)}>
                  {ex}
                </button>
              ))}
            </div>
            <Button type="primary" htmlType="submit" size="large" icon={<ThunderboltOutlined />} loading={isGenerating} className="grad-btn">
              Generate
            </Button>
          </div>
        </form>
      </section>

      {!isGenerating && !generatedPost && (
        <ol className="steps">
          <li>
            <span>1</span>
            <strong>Describe it</strong>
            <em>Subject, setting, light and style all help.</em>
          </li>
          <li>
            <span>2</span>
            <strong>DALL·E 3 draws it</strong>
            <em>The image is generated on the server with your prompt.</em>
          </li>
          <li>
            <span>3</span>
            <strong>It is posted</strong>
            <em>The result lands in Explore, ready to like, share and search.</em>
          </li>
        </ol>
      )}

      {(isGenerating || generatedPost) && (
        <section className="result">
          {isGenerating ? (
            <div className="result-card generating" aria-live="polite">
              <div className="shimmer" />
              <div className="result-body">
                <strong>Generating…</strong>
                <span className="muted">DALL·E 3 is drawing your image. It is published as soon as it is ready.</span>
              </div>
            </div>
          ) : (
            generatedPost && (
              <div className="result-card">
                <Image src={generatedPost.url} alt={generatedPost.message} className="result-image" />
                <div className="result-body">
                  <p className="result-caption">{generatedPost.message}</p>
                  <div className="result-actions">
                    <Button icon={<CompassOutlined />} onClick={() => navigate("/collection")}>
                      View in Explore
                    </Button>
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setGeneratedPost(null);
                        setPrompt("");
                      }}
                    >
                      Generate another
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}

export default Landing;
