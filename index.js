import express from "express";
import path from "path";
import { MongoClient } from "mongodb";

const publicPath = path.resolve("public");
const app = express();
app.use(express.static(publicPath));
app.use(express.urlencoded({extended:false}))

const dbName = 'nodejs'
const collection = 'todo'
const url = 'mongodb://localhost:27017'
const client =new MongoClient(url)

const connectDB = async () => {
  await client.connect();           // properly connect
  return client.db(dbName);         // return the database
};



app.set("view engine", "ejs");
app.get("/", async(req, res) => {
    const db= await connectDB()
    const connection=db.collection(collection)
    const result =await connection.find().toArray()
    console.log(result)
  res.render("list",{result});
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});
app.post("/add", async(req, res) => {
      console.log(req.body)

    const db = await connectDB()

    const connection = db.collection(collection)
    const result = connection.insertOne(req.body)

  res.redirect("/");
});


app.listen(3200);
