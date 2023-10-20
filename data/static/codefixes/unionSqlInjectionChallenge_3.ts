import { Request, Response, NextFunction } from 'express';

module.exports = function searchProducts() {
  return (req: Request, res: Response, next: NextFunction) => {
    let criteria: string = req.query.q ?? '';
    criteria = criteria.substring(0, 200);

    
    if (!criteria.startsWith("apple") && !criteria.startsWith("orange")) {
      res.status(400).send();
      return;
    }

    models.sequelize.query(
      `SELECT * FROM Products WHERE (name LIKE :criteria OR description LIKE :criteria) AND deletedAt IS NULL ORDER BY name`,
      {
        replacements: { criteria: `%${criteria}%` },
        type: models.sequelize.QueryTypes.SELECT,
      }
    )
      .then((products: any) => {
        const dataString = JSON.stringify(products);
        for (let i = 0; i < products.length; i++) {
          products[i].name = req.__(products[i].name);
          products[i].description = req.__(products[i].description);
        }
        res.json(utils.queryResultToJson(products));
      })
      .catch((error: ErrorWithParent) => {
        next(error.parent);
      });
  };
};
