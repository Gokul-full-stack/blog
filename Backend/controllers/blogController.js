const Blog = require("../models/Blog");
const User = require("../models/User"); // to fetch author's name

// Create Blog
exports.createBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user); // req.user = userId from token
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, category, content, image } = req.body;
    const blog = new Blog({
      title,
      category,
      content,
      image,
      author: user.name,
      userId: user._id,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to create blog", error: err.message });
  }
};

// Get All Blogs (with optional filters)
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, author } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (author) filter.author = author;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog", error: err.message });
  }
};

// Update Blog
exports.updateBlog = async (req, res) => {
    try {
      console.log('Update blog ID:', req.params.id);
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        console.log('Blog not found');
        return res.status(404).json({ message: "Blog not found" });
      }
      if (blog.userId.toString() !== req.user) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: new Date() },
        { new: true }
      );
      res.status(200).json(updatedBlog);
    } catch (err) {
      console.error('Error updating blog:', err);
      res.status(500).json({ message: "Failed to update blog", error: err.message });
    }
  };
  

// Delete Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.userId.toString() !== req.user)
      return res.status(403).json({ message: "Unauthorized" });

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog", error: err.message });
  }
};

// Get Blogs of logged-in user
exports.getMyBlogs = async (req, res) => {
  console.log('getMyBlogs route hit');
  try {
    const blogs = await Blog.find({ userId: req.user }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error('Error fetching my blogs:', err);
    res.status(500).json({ message: 'Failed to fetch your blogs', error: err.message });
  }
};
