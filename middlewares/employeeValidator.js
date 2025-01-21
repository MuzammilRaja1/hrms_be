module.exports = (req, res, next) => {
  const { email, role, designation, firstName, lastName } = req.body;

  if (!email || !role || !firstName, !designation) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // if (username.length < 3 || username.length > 15) {
  //   return res.status(400).json({ success: false, message: 'Username must be between 3 and 15 characters' });
  // }
  if (firstName?.length < 3 || firstName?.length > 15) {
    return res.status(400).json({ success: false, message: 'First name must be between 3 and 15 characters' });
  }



  // if (password !== confirmPassword) {
  //   return res.status(400).json({ success: false, message: 'Passwords do not match' });
  // }

  if (!['HR', 'EMP', 'ADMIN', 'other'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role selected' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  next();
};
