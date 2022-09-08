import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog tests", () => {
  const blog = {
    title: "This is a test title for ze Blog",
    author: "Testi Tero",
    url: "http://localhost:3003/api/blogs",
    likes: 0,
    user: {
      username: "paulik",
      name: "Pauli Karels",
    },
  };
  //user, toggle
  const mockHandler = jest.fn();

  let container;
  beforeEach(() => {
    container = render(
      <Blog blog={blog} user={mockHandler} updateBlog={mockHandler} />
    ).container;
  });

  test("renders blog title and author but no url or likes", () => {
    //const { container } = render(<Blog blog={blog} user={mockHandler} />)
    const div = container.querySelector(".blog");

    expect(div).toHaveTextContent(blog.title);
    expect(div).toHaveTextContent(blog.author);

    expect(div).not.toHaveTextContent(blog.url);
    expect(div).not.toHaveTextContent(blog.likes);
    //screen.debug()
  });

  test("renders url and likes as well once button clicked", async () => {
    const div = container.querySelector(".blog");

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    expect(div).toHaveTextContent(blog.title);
    expect(div).toHaveTextContent(blog.author);
    expect(div).toHaveTextContent(blog.url);
    expect(div).toHaveTextContent(blog.likes);
    //screen.debug()
  });

  test("button is pressed twice and 2 mockcalls are called ", async () => {
    //const div = container.querySelector('.blog')

    //render(<Blog blog={blog} user={mockHandlerTest}  toggleVisibility={mockHandlerTest}/>)

    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    //screen.debug()
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
