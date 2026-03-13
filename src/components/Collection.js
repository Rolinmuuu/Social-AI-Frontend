import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, message, Row, Col } from "antd";

import SearchBar from "./SearchBar";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs;

function Collection(props) {
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keywords: "",
  });
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("image");

  const handleSearch = (option) => {
    setSearchOption(option);
  };

  useEffect(() => {
    fetchPosts(searchOption);
  }, [searchOption]);

  const fetchPosts = (searchOption) => {
    const { type, keywords } = searchOption;
    let url = "";

    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.keywords) {
      url = `${BASE_URL}/search?keywords=${keywords}`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keywords}`;
    }

    const searchOptions = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
    };

    axios(searchOptions)
      .then((response) => {
        if (response.status === 200) {
          setPosts(response.data);
        }
      })
      .catch(() => {
        message.error("Failed to fetch posts, try again later");
      });
  };

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      return <div>No posts found</div>;
    }

    let filteredPosts;
    if (type === "image") {
      filteredPosts = posts.filter((post) => post.type === "image");
      if (!filteredPosts || filteredPosts.length === 0) {
        return <div>No images found</div>;
      }
      const imageArr = filteredPosts.map((image) => {
        return {
          postId: image.postId,
          src: image.url,
          user: image.user,
          caption: image.message,
          thumbnail: image.url,
          thumbnailWidth: 300,
          thumbnailHeight: 200,
        };
      });
      return <PhotoGallery images={imageArr} />;
    } else if (type === "video") {
      filteredPosts = posts.filter((post) => post.type === "video");
      if (!filteredPosts || filteredPosts.length === 0) {
        return <div>No videos found</div>;
      }
      return (
        <Row>
          {filteredPosts.map((post) => {
            return (
              <Col span={24} key={post.url}>
                <video src={post.url} controls={true} />
              </Col>
            );
          })}
        </Row>
      );
    }
  };

  const showPost = (postType) => {
    setActiveTab(postType);
    setTimeout(() => {
      setSearchOption({
        type: SEARCH_KEY.all,
        keywords: "",
      });
    }, 3000);
  };

  const operations = <CreatePostButton onShowPost={showPost} />;

  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch} />
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="image"
          activeKey={activeTab}
          tabBarExtraContent={operations}
        >
          <TabPane tab="Image" key="image">
            {renderPosts("image")}
          </TabPane>
          <TabPane tab="Video" key="video">
            {renderPosts("video")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Collection;
