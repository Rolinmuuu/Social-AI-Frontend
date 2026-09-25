import React, { useState } from "react";
import { Input, Segmented } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { SEARCH_KEY } from "../constants";
import type { SearchKeyType } from "../constants";

interface SearchBarProps {
  handleSearch: (option: { type: SearchKeyType; keywords: string }) => void;
}

const MODES: { label: string; value: SearchKeyType; hint: string }[] = [
  { label: "All", value: SEARCH_KEY.all, hint: "Showing every post" },
  { label: "Keywords", value: SEARCH_KEY.keywords, hint: "Match words in the caption" },
  { label: "User", value: SEARCH_KEY.user, hint: "Posts by one user ID" },
  { label: "Semantic", value: SEARCH_KEY.semantic, hint: "Match by meaning, using embeddings" },
];

function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchType, setSearchType] = useState<SearchKeyType>(SEARCH_KEY.all);
  const [error, setError] = useState("");

  const changeSearchType = (value: SearchKeyType) => {
    setSearchType(value);
    setError("");
    if (value === SEARCH_KEY.all) handleSearch({ type: value, keywords: "" });
  };

  const onSearch = (value: string) => {
    if (searchType !== SEARCH_KEY.all && value.trim() === "") {
      setError("Please enter a search keyword");
      return;
    }
    setError("");
    handleSearch({ type: searchType, keywords: value.trim() });
  };

  const placeholder =
    searchType === SEARCH_KEY.semantic
      ? "Describe what you're looking for, e.g. “cozy rainy evening”"
      : searchType === SEARCH_KEY.user
        ? "Enter a user ID"
        : searchType === SEARCH_KEY.keywords
          ? "Search captions"
          : "Pick a search mode to search";

  return (
    <div className="search-panel">
      <Segmented<SearchKeyType>
        options={MODES.map((m) => ({ label: m.label, value: m.value }))}
        value={searchType}
        onChange={changeSearchType}
        className="search-modes"
      />
      <Input.Search
        placeholder={placeholder}
        enterButton={
          <span>
            <SearchOutlined /> Search
          </span>
        }
        size="large"
        allowClear
        onSearch={onSearch}
        disabled={searchType === SEARCH_KEY.all}
        aria-label="Search posts"
        className="search-input"
      />
      <p className={`search-hint${error ? " error-message" : ""}`} role={error ? "alert" : undefined}>
        {error || MODES.find((m) => m.value === searchType)?.hint}
      </p>
    </div>
  );
}

export default SearchBar;
