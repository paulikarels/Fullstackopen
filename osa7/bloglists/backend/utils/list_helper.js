// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const calculator = blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
  return calculator;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0 || !blogs) return null;

  const test = blogs.reduce((prev, current) =>
    current.likes > prev.likes ? current : prev
  );

  const blog = {
    title: test.title,
    author: test.author,
    likes: test.likes,
  };

  return blog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0 || !blogs) return null;

  const test = blogs
    .map((blog) => blog.author)
    .reduce((current, obj) => {
      current[obj] ? current[obj]++ : (current[obj] = 1);
      return current;
    }, {});

  const testToArray = Object.entries(test).reduce((a, b) =>
    test[a] > test[b] ? a : b
  );

  const blog = {
    author: testToArray[0],
    blogs: testToArray[1],
  };

  return blog;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0 || !blogs) return null;

  const test = blogs
    .map((blog) => ({ author: blog.author, likes: blog.likes }))
    .reduce((current, obj) => {
      const authorExists = current.find((item) => item.author === obj.author);
      if (authorExists) {
        authorExists.likes += obj.likes;
        return current;
      }
      current.push(obj);
      return current;
    }, []);

  return test.reduce((a, b) => (a.likes > b.likes ? a : b));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
