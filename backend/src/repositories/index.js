module.exports = {
  users: require('./user.repository'),
  courses: require('./course.repository'),
  wishlistItems: require('./wishlist.repository'),
  cartItems: require('./cart.repository'),
  enrollments: require('./enrollment.repository')
};
