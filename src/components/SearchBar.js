import React, { useState } from "react";
import { Input, Radio } from "antd";
import { SEARCH_KEY } from "../constants";

const { Search } = Input;

const SearchBar = (props) => {
  const [searchType, setSearchType] = useState(SEARCH_KEY.all);
  const [error, setError] = useState("");

  const changeSearchType = (e) => {
    const userValue = e.target.value;
    setSearchType(userValue);
    setError("");
    if (userValue === SEARCH_KEY.all) {
      props.handleSearch({
        type: userValue,
        keywords: "",
      });
    }
  };
  const handleSearch = (value) => {
    if (searchType !== SEARCH_KEY.all && value === "") {
      setError("Please enter a search keyword");
      return;
    }
    setError("");
    props.handleSearch({
      type: searchType,
      keywords: value,
    });
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
        onSearch={handleSearch}
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
};

export default SearchBar;
