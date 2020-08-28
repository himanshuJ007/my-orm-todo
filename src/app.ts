import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import { createConnection } from "typeorm";
import { Todo } from "./entity/todo";
import cors from 'cors';
import path from "path"

 
const app = express();
app.use(express.static(path.join(__dirname,"../public")));
app.use(bodyParser.json());
app.use(cors());



app.use(bodyParser.urlencoded({ extended: true }));
const connection = createConnection({
    type: "mysql",
    host: "us-cdbr-east-02.cleardb.com",
    port: 3306,
    username: "b0e2c3c7f969bd",
    password: "382a178d",
    database: "heroku_1a0cfb96de49b15",
    entities: [Todo],
    synchronize: true,
})
app.get("", async (req, res) => {
    res
    .status(200)
    .sendFile(path.join(__dirname,"../public/html","index.html"));

})
// simple route
app.get("/todo", async (req, res) => {
    connection.then(async connection => {

        // let savedPhotos = await connection.manager.find(Todo);
        // console.log("All Todos from the db: ", savedPhotos);

        let todoRepo = connection.getRepository(Todo);
        let allTodos = await todoRepo.find();
        //console.log("All Todos from the db: ", allTodos);
        res.send(allTodos);

    }).catch((error) => {
        console.log(error);
        res.send(error);
    });


});

app.post("/todo", async (req, res) => {
    connection.then(connection => {

        // here you can start to work with your entities

        let todo = new Todo();
        todo.Task_name = req.body.Task_name;
        todo.description = req.body.description;
        todo.isCompleted = req.body.isCompleted;
        return connection.manager
            .save(todo)
            .then(todo => {
                console.log("Todo has been saved. Todo id is", todo.id);
                res.send(todo)
            });


    }).catch((error) => {
        console.log(error);
        res.send(error);
    });

});

app.put("/todo/:id", async (req, res) => {

    connection.then(async connection => {
        let id: number = parseInt(req.params.id);
        let todo = new Todo();
        todo.id = req.body.id;
        todo.Task_name = req.body.Task_name;
        todo.description = req.body.description;
        todo.isCompleted = req.body.isCompleted;

        let todoRepo = connection.getRepository(Todo);
        await todoRepo.update(
            { id: id },
            todo,
        );
        const updatedContact = await todoRepo.findOne(req.params.id);
        res.send(updatedContact);

    }).catch((error) => {
        console.log(error);
        res.send(error);
    });
});

app.delete("/todo/:id", async (req, res) => {
    connection.then(async connection => {
        let todo: Todo = new Todo();
        let id: number = parseInt(req.params.id);
        let todoRepo = connection.getRepository(Todo);
        let todoToRemove = await todoRepo.findOne({ id: id });
        todo.id = id;
        await todoRepo.remove(todo)
        console.log("successfully deleted");
        res.send(todoToRemove);


    }).catch((error) => {
        console.log(error);
        res.send(error);
    });

});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});