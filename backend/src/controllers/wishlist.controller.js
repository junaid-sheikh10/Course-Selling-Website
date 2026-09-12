const wishlistService = require('../services/wishlist.service');

async function addCourse(req, res) {
  const wishlistItem = await wishlistService.addCourse(req.user.id, req.params.courseId);
  return res.status(200).json({
    message: 'Course added to wishlist',
    wishlistItem
  });
}

module.exports = { addCourse };
