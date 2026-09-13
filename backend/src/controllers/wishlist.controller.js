const wishlistService = require('../services/wishlist.service');

async function getAll(req, res) {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  return res.status(200).json({ wishlist });
}

async function addCourse(req, res) {
  const wishlistItem = await wishlistService.addCourse(req.user.id, req.params.courseId);
  return res.status(200).json({
    message: 'Course added to wishlist',
    wishlistItem
  });
}

async function removeCourse(req, res) {
  await wishlistService.removeCourse(req.user.id, req.params.courseId);
  return res.status(200).json({ message: 'Course removed from wishlist' });
}

module.exports = { getAll, addCourse, removeCourse };
