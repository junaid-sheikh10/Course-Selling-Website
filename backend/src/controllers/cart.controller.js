const cartService = require('../services/cart.service');

async function addCourse(req, res) {
  const cartItem = await cartService.addCourse(req.user.id, req.params.courseId);
  return res.status(200).json({
    message: 'Course added to cart',
    cartItem
  });
}

module.exports = { addCourse };
