import initApp from "./app"; 

initApp().then((app) => {
    app.get("/", (req,res) =>{
        res.send("get student");
    });
    const port = process.env.PORT;
    app.listen(port, () =>{
        console.log(`Example at http://localhost:${port}/`);
    });
});