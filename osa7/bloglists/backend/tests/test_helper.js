const Blog = require("../models/blog");
const User = require("../models/user");

const intialBlogs = [
  {
    title: "Testaaminen",
    author: "Testi Tero",
    url: "http://localhost:3001/test",
    likes: 0,
  },
  {
    title: "Kokeilu",
    author: "Näytötkoe Nero",
    url: "http://localhost:3001/test",
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "willremovethissoon",
    author: "delet andy",
    url: "gg",
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  intialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
