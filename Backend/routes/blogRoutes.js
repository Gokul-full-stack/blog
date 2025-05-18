const express = require('express');
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlogById,    // added this
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../controllers/blogController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/blogs', authMiddleware, getAllBlogs);
router.get('/blogs/:id', authMiddleware, getBlogById);  // new route for single blog
router.get('/myblogs', authMiddleware, getMyBlogs);
router.post('/blogs', authMiddleware, createBlog);
router.put('/blogs/:id', authMiddleware, updateBlog);
router.delete('/blogs/:id', authMiddleware, deleteBlog);

module.exports = router;
