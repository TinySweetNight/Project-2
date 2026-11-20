
//Return not found page
const notFound = (req, res) => {
  return res.render('notFound');
};

module.exports = {
    notFound
};