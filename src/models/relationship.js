import { Model, DataTypes } from 'sequelize'

export default async function({ sequelize }) {
    const User = sequelize.models.User
        // const Order = sequelize.models.Order
    const Product = sequelize.models.Product
    const Category = sequelize.models.Category

    await Product.belongsTo(Category, {
        foreignKey: 'category_id',
    })
}