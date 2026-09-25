import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import SearchBar from "./components/SearchBar";
import { buildSearchUrl, initials } from "./lib/search";
import { SEARCH_KEY } from "./constants";

test("renders the sign-in page when logged out", () => {
  localStorage.clear();
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  // getByRole is avoided: jsdom's selector engine chokes on antd's CSS-in-JS rules.
  expect(screen.getByText("Welcome back").tagName).toBe("H2");
  expect(screen.getByText("Sign in").closest("button")).toHaveAttribute("type", "submit");
});

test("builds the backend search URL for each mode", () => {
  const base = "http://api";
  expect(buildSearchUrl(base, { type: SEARCH_KEY.all, keywords: "" })).toBe("http://api/search");
  expect(buildSearchUrl(base, { type: SEARCH_KEY.keywords, keywords: "sun set" })).toBe("http://api/search?keywords=sun%20set");
  expect(buildSearchUrl(base, { type: SEARCH_KEY.user, keywords: "ann" })).toBe("http://api/search?user_id=ann");
  expect(buildSearchUrl(base, { type: SEARCH_KEY.semantic, keywords: "cozy rain" })).toBe(
    "http://api/search?mode=semantic&keywords=cozy%20rain",
  );
  expect(buildSearchUrl(base, { type: SEARCH_KEY.semantic, keywords: "" })).toBe("http://api/search");
});

test("initials handle usernames with separators", () => {
  expect(initials("maya_lin")).toBe("ML");
  expect(initials("oliver")).toBe("OL");
  expect(initials("")).toBe("?");
});

test("search bar asks for a keyword before searching in keyword mode", () => {
  const handleSearch = jest.fn();
  render(<SearchBar handleSearch={handleSearch} />);

  fireEvent.click(screen.getByText("Keywords"));
  const input = screen.getByLabelText("Search posts");
  fireEvent.keyDown(input, { key: "Enter", code: "Enter", keyCode: 13 });
  expect(screen.getByText(/enter a search keyword/i)).toHaveAttribute("role", "alert");
  expect(handleSearch).not.toHaveBeenCalled();

  fireEvent.change(input, { target: { value: "beach" } });
  fireEvent.click(screen.getByText("Search").closest("button") as HTMLElement);
  expect(handleSearch).toHaveBeenCalledWith({ type: SEARCH_KEY.keywords, keywords: "beach" });
});
