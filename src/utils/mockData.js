export default async function({ sequelize }) {
    // mock user data
    const user = await sequelize.models.User.bulkCreate([
        { user_name: 'Tohir', user_password: '2f1a2282362b1a1b29d34c41b6f1c66ad357270628a85589c4373518f36c2bbe', user_is_admin: true },
        { user_name: 'Jakhongir', user_password: '12922da7c33fe5092dc447f7d121c809447da439e2a2492f83d0df34bd0b6530', user_is_admin: false },
        { user_name: 'Burkhon', user_password: 'cafc2d5348bd9dc47830cab0f50318a2bceb4ca37dbc6e5b3f15d0970e4ac077', user_is_admin: false },
    ])

    const category = await sequelize.models.Category.bulkCreate([
        { category_name: 'Badiiy Kitoblar' },
        { category_name: 'Ertak kitoblar' },
    ])

//     const products = await sequelize.models.Product.bulkCreate([{
//             category_id: 1,
//             product_name: 'Ikki eshik orasi',
//             product_author: "Otkir Xoshimov",
//             product_img: 'ikki eshik orasi.jpg',
//             product_files_name: "olma",
//             product_price: 50000,
//             short_description: 'Ikki eshik orasi',
//             long_description: 'Ikki eshik orasi kitob juda yaxshi yozilgan'
//         },
//         {
//             category_id: 2,
//             product_name: 'Uch bahodir',
//             product_author: 'Xalq ogzaki ijodi',
//             product_img: 'uchbahodir.jpg',
//             product_files_name: "olma",
//             product_price: 25000,
//             short_description: 'bolalar uchun yaxshi ertak kitob',
//             long_description: 'bolalar uchun juda ajoyib kitob ekan bolalarni uxlashidan avval oqib berish uchun ham juda yaxshi'
//         }
//     ])
}
