const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.intialBlogs);
});
describe("Blog tests", () => {
  test("return correct amount of blogs that are returned as json", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(helper.intialBlogs.length);
  });
  /*
  test('return correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.intialBlogs.length)
  })
  */
  test("blogs have a prorper id", async () => {
    const response = await api.get("/api/blogs");

    expect(response.body[0].id).toBeDefined();
  });
});

describe("Blog 4.23 tests", () => {
  let token = null;
  beforeAll(async () => {
    await User.deleteMany({});
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("salainen", saltRounds);

    const user = await new User({
      username: "testman12345",
      name: "Testi Tero",
      passwordHash,
    }).save();

    const loginUser = { username: "testman12345", id: user.id };
    return (token = jwt.sign(loginUser, process.env.SECRET));
  });

  test("a blog can be successfully added", async () => {
    const blog = {
      title: "added",
      author: "addeddededededededed",
      url: "http://localhost:3001/adadadadadadadadad",
      likes: 123,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain("added");
  });

  test("a blog without likes is set to 0", async () => {
    const blog = {
      title: "added2",
      author: "addeddededededededed2",
      url: "http://localhost:3001/adadadadadadadadad2",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length + 1);

    expect(blogsAtEnd[helper.intialBlogs.length].likes).toBe(0);
  });

  test("blog without title or ulr is not added", async () => {
    const blog = {
      author: "notadded",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.intialBlogs.length);
  });

  test("delete a blog", async () => {
    await Blog.deleteMany({});

    const test = {
      title: "added2",
      author: "adadadadadad",
      url: "http://localhost:3001/adadadadadadadadad3",
    };

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("salainen", saltRounds);

    const user = await new User({
      username: "testman12345",
      name: "Testi Tero",
      passwordHash,
    }).save();

    const loginUser = { username: "testman12345", id: user.id };
    token = jwt.sign(loginUser, process.env.SECRET);

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(test)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("edit a blog", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogtoEdit = blogsAtStart[0];
    const count = blogtoEdit.likes;
    blogtoEdit.likes = blogtoEdit.likes + 1;

    await api.put(`/api/blogs/${blogtoEdit.id}`).send(blogtoEdit).expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd[0].likes).toBe(count + 1);
  });
});

describe("User tests in db", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("salainen", saltRounds);

    const user = await new User({
      username: "testman123",
      name: "Testi Tero",
      passwordHash,
    }).save();

    const loginUser = { username: "testman12345", id: user.id };
    return (token = jwt.sign(loginUser, process.env.SECRET));
  });
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testman123",
      name: "Testi Tero",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test(`creation fails with proper statuscode and message if username or password doesn't match required length`, async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Ed",
      name: "Testi Tero",
      password: "salainen",
    };

    const newUser2 = {
      username: "Hello",
      name: "Testi Tero",
      password: "xx",
    };

    const result1 = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result1.body.error).toContain(
      "is shorter than the minimum allowed length (3)"
    );

    const result2 = await api
      .post("/api/users")
      .send(newUser2)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result2.body.error).toContain(
      "is shorter than the minimum allowed length (3)"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test(`creation fails with proper statuscode and message if username or password doesn't exist `, async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Testi Tero",
      password: "salainen",
    };

    const newUser2 = {
      username: "Hello",
      name: "Testi Tero",
    };

    const result1 = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result1.body.error).toContain("Path `username` is required");

    const result2 = await api
      .post("/api/users")
      .send(newUser2)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result2.body.error).toContain("password must exist");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

//jest.setTimeout(20000)
afterAll(() => {
  mongoose.connection.close();
});
