"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const body_parser_1 = __importDefault(require("body-parser"));
const typeorm_1 = require("typeorm");
const todo_1 = require("./entity/todo");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use(body_parser_1.default.json());
app.use(cors_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const connection = typeorm_1.createConnection({
    type: "mysql",
    host: "us-cdbr-east-02.cleardb.com",
    port: 3306,
    username: "b0e2c3c7f969bd",
    password: "382a178d",
    database: "heroku_1a0cfb96de49b15",
    entities: [todo_1.Todo],
    synchronize: true,
});
app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res
        .status(200)
        .sendFile(path_1.default.join(__dirname, "../public/html", "index.html"));
}));
// simple route
app.get("/todo", (req, res) => __awaiter(this, void 0, void 0, function* () {
    connection.then((connection) => __awaiter(this, void 0, void 0, function* () {
        // let savedPhotos = await connection.manager.find(Todo);
        // console.log("All Todos from the db: ", savedPhotos);
        let todoRepo = connection.getRepository(todo_1.Todo);
        let allTodos = yield todoRepo.find();
        //console.log("All Todos from the db: ", allTodos);
        res.send(allTodos);
    })).catch((error) => {
        console.log(error);
        res.send(error);
    });
}));
app.post("/todo", (req, res) => __awaiter(this, void 0, void 0, function* () {
    connection.then(connection => {
        // here you can start to work with your entities
        let todo = new todo_1.Todo();
        todo.Task_name = req.body.Task_name;
        todo.description = req.body.description;
        todo.isCompleted = req.body.isCompleted;
        return connection.manager
            .save(todo)
            .then(todo => {
            console.log("Todo has been saved. Todo id is", todo.id);
            res.send(todo);
        });
    }).catch((error) => {
        console.log(error);
        res.send(error);
    });
}));
app.put("/todo/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    connection.then((connection) => __awaiter(this, void 0, void 0, function* () {
        let id = parseInt(req.params.id);
        let todo = new todo_1.Todo();
        todo.id = req.body.id;
        todo.Task_name = req.body.Task_name;
        todo.description = req.body.description;
        todo.isCompleted = req.body.isCompleted;
        let todoRepo = connection.getRepository(todo_1.Todo);
        yield todoRepo.update({ id: id }, todo);
        const updatedContact = yield todoRepo.findOne(req.params.id);
        res.send(updatedContact);
    })).catch((error) => {
        console.log(error);
        res.send(error);
    });
}));
app.delete("/todo/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    connection.then((connection) => __awaiter(this, void 0, void 0, function* () {
        let todo = new todo_1.Todo();
        let id = parseInt(req.params.id);
        let todoRepo = connection.getRepository(todo_1.Todo);
        let todoToRemove = yield todoRepo.findOne({ id: id });
        todo.id = id;
        yield todoRepo.remove(todo);
        console.log("successfully deleted");
        res.send(todoToRemove);
    })).catch((error) => {
        console.log(error);
        res.send(error);
    });
}));
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
