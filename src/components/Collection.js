import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, message, Row, Col, Empty } from "antd";

import SearchBar from "./SearchBar";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import PostCard from "./PostCard";
import CreatePostButton from "./CreatePostButton";

function Collection() {
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

  const fetchPosts = ({ type, keywords }) => {
    let url = `${BASE_URL}/search`;

    if (type === SEARCH_KEY.keywords && keywords) {
      url += `?keywords=${encodeURIComponent(keywords)}`;
    } else if (type === SEARCH_KEY.user && keywords) {
      url += `?user_id=${encodeURIComponent(keywords)}`;
    } else if (type === SEARCH_KEY.semantic && keywords) {
      url += `?mode=semantic&keywords=${encodeURIComponent(keywords)}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setPosts(response.data?.posts || []);
        }
      })
      .catch(() => {
        message.error("Failed to fetch posts, try again later");
      });
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.post_id !== postId));
  };

  const renderPosts = (type) => {
    const filteredPosts = posts.filter((post) => post.type === type);

    if (!filteredPosts || filteredPosts.length === 0) {
      return <Empty description={`No ${type}s found`} />;
    }

    return (
      <Row gutter={[16, 16]}>
        {filteredPosts.map((post) => (
          <Col xs={24} sm={12} lg={8} key={post.post_id}>
            <PostCard post={post} onDelete={handleDeletePost} />
          </Col>
        ))}
      </Row>
    );
  };

  const showPost = (postType) => {
    setActiveTab(postType);
    setTimeout(() => {
      setSearchOption({ type: SEARCH_KEY.all, keywords: "" });
    }, 3000);
  };

  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch} />
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="image"
          activeKey={activeTab}
          tabBarExtraContent={<CreatePostButton onShowPost={showPost} />}
          items={[
            { key: "image", label: "Image", children: renderPosts("image") },
            { key: "video", label: "Video", children: renderPosts("video") },
          ]}
        />
      </div>
    </div>
  );
}

export default Collection;
