import express from "express";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";

const publicPath = path.resolve("public");
const app = express();
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));

const dbName = "nodejs";
const collection = "todo";
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const connectDB = async () => {
  await client.connect(); // properly connect
  return client.db(dbName); // return the database
};

app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const db = await connectDB();
  const connection = db.collection(collection);
  const result = await connection.find().toArray();

  res.render("list", { result });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.get("/update", (req, res) => {
  res.render("update");
});
app.post("/add", async (req, res) => {
  console.log(req.body);
  const db = await connectDB();
  const connection = db.collection(collection);
  const result =  await connection.insertOne(req.body);

  res.redirect("/");
});

app.get("/delete/:id", async (req, res) => {
  
  const db = await connectDB();
  const connection = db.collection(collection);
  const result = await connection.deleteOne({ _id: new ObjectId(req.params.id) });
  if (result) {
    res.redirect("/");
  } else {
    res.send("some error");
  }
});

app.get("/update/:id", async (req, res) => {
  const id =req.params.id
  const db = await connectDB();
  const connection = db.collection(collection);
  const result =  await connection.findOne({ _id: new ObjectId(id) });
  
  if (result) {
       res.render("update", { result }); 
  } else {
    res.send("some error");
  }
});

app.listen(3300);
