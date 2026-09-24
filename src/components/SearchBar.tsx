import React, { useState } from "react";
import { Input, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { SEARCH_KEY } from "../constants";
import type { SearchKeyType } from "../constants";

const { Search } = Input;

interface SearchBarProps {
  handleSearch: (option: { type: SearchKeyType; keywords: string }) => void;
}

function SearchBar({ handleSearch }: SearchBarProps) {
  const [searchType, setSearchType] = useState<SearchKeyType>(SEARCH_KEY.all);
  const [error, setError] = useState("");

  const changeSearchType = (e: RadioChangeEvent) => {
    const userValue = e.target.value as SearchKeyType;
    setSearchType(userValue);
    setError("");
    if (userValue === SEARCH_KEY.all) {
      handleSearch({ type: userValue, keywords: "" });
    }
  };

  const onSearch = (value: string) => {
    if (searchType !== SEARCH_KEY.all && value === "") {
      setError("Please enter a search keyword");
      return;
    }
    setError("");
    handleSearch({ type: searchType, keywords: value });
  };

  const getPlaceholder = () => {
    if (searchType === SEARCH_KEY.semantic) {
      return "Describe what you're looking for...";
    }
    if (searchType === SEARCH_KEY.user) {
      return "Enter user ID";
    }
    return "Enter your search keyword";
  };

  return (
    <div className="search-bar">
      <Search
        placeholder={getPlaceholder()}
        enterButton="Search"
        size="large"
        onSearch={onSearch}
        disabled={searchType === SEARCH_KEY.all}
      />
      <p className="error-message">{error}</p>
      <Radio.Group
        onChange={changeSearchType}
        value={searchType}
        className="search-type-group"
      >
        <Radio value={SEARCH_KEY.all}>All</Radio>
        <Radio value={SEARCH_KEY.keywords}>Keywords</Radio>
        <Radio value={SEARCH_KEY.user}>User</Radio>
        <Radio value={SEARCH_KEY.semantic}>Semantic</Radio>
      </Radio.Group>
    </div>
  );
}

export default SearchBar;
