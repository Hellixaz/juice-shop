module.exports = function searchProducts() {
  return (req, res, next) => {
    let criteria = req.query.q || ''; 
    criteria = criteria.slice(0, 200);
    const query = `SELECT * FROM Products WHERE (name LIKE :criteria OR description LIKE :criteria) AND deletedAt IS NULL ORDER BY name`;
    models.sequelize.query(query, {
      replacements: { criteria: `%${criteria}%` },
      type: models.sequelize.QueryTypes.SELECT,
    })
      .then((products) => {
        products = products.map((product) => {
          return {
            name: req.__(product.name),
            description: req.__(product.description),
          };
        });
        res.json(utils.queryResultToJson(products));
      })
      .catch((error) => {
        next(error);
      });
  };
};
