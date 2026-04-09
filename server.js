const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

/* Database Connection */
const db = mysql.createConnection({
host: "localhost",
user: "root",
password: "Root@2006",   // 🔁 replace with your MySQL password
database: "restaurant_system"
})

db.connect(err => {
if (err) throw err
console.log("MySQL Connected")
})

/* =========================
   1. GET MENU
========================= */
app.get("/menu", (req, res) => {

const sql = "SELECT * FROM menu"

db.query(sql, (err, result) => {
if (err) throw err
res.json(result)
})

})

/* =========================
   2. PLACE ORDER (WITH QUANTITY)
========================= */
app.post("/order", (req, res) => {

const { customer_name, item_id, quantity } = req.body

const sql = "INSERT INTO orders (customer_name, item_id, quantity) VALUES (?, ?, ?)"

db.query(sql, [customer_name, item_id, quantity], (err, result) => {
if (err) throw err
res.json({ message: "Order Placed Successfully" })
})

})

/* =========================
   3. VIEW ALL ORDERS (ADMIN)
========================= */
app.get("/orders", (req, res) => {

const sql = `
SELECT orders.id, orders.customer_name, menu.item_name, menu.price, orders.quantity
FROM orders
JOIN menu ON orders.item_id = menu.id
`

db.query(sql, (err, result) => {
if (err) throw err
res.json(result)
})

})

/* =========================
   4. GENERATE BILL (BY CUSTOMER)
========================= */
app.get("/bill/:name", (req, res) => {

const name = req.params.name

const sql = `
SELECT orders.customer_name, menu.item_name, menu.price, orders.quantity
FROM orders
JOIN menu ON orders.item_id = menu.id
WHERE orders.customer_name = ?
`

db.query(sql, [name], (err, result) => {
if (err) throw err
res.json(result)
})

})

/* =========================
   SERVER START
========================= */
app.listen(3000, () => {
console.log("Server running on port 3000")
})