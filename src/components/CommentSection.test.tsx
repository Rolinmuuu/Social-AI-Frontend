import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommentSection from "./CommentSection";
import { installDemoApi } from "../demo/mockApi";
import { TOKEN_KEY } from "../constants";

beforeAll(() => installDemoApi());
beforeEach(() => localStorage.setItem(TOKEN_KEY, "demo.maya_lin"));

test("shows existing comments, labels your own as You, and appends a new one", async () => {
  render(<CommentSection postId="demo-6" />);

  expect(await screen.findByText("How many layers is this?")).toBeInTheDocument();
  expect(screen.getByText("atelier_k")).toHaveClass("comment-author");

  fireEvent.change(screen.getByLabelText("Add a comment"), { target: { value: "Love the colours" } });
  fireEvent.click(screen.getByLabelText("Post comment"));
  // Wait for the list entry (the textarea also contains the text until the request succeeds).
  const mine = await screen.findByText("You");
  expect(mine).toHaveClass("comment-author");
  expect(mine.closest("li")).toHaveTextContent("Love the colours");
  expect(screen.getByLabelText("Add a comment")).toHaveValue("");
});

test("says so when a post has no comments", async () => {
  render(<CommentSection postId="demo-2" />);
  expect(await screen.findByText("No comments yet.")).toBeInTheDocument();
});

test("loads further pages on demand", async () => {
  render(<CommentSection postId="demo-10" pageSize={2} />);
  expect(await screen.findByText(/excellent taste/)).toBeInTheDocument();
  expect(screen.queryByText(/three hours/)).toBeNull();

  fireEvent.click(await screen.findByText("Show more comments"));
  expect(await screen.findByText(/three hours/)).toBeInTheDocument();
  expect(screen.getByText(/excellent taste/)).toBeInTheDocument(); // appended, not replaced
  expect(screen.queryByText("Show more comments")).toBeNull();
});
