require("dotenv").config();

console.log(
"ENV TEST:",
process.env.GROQ_API_KEY
);

const express = require("express");
const cors = require("cors");

const { createClient } =
require("@supabase/supabase-js");


require("dotenv").config();

console.log("ENV TEST:", process.env.GROQ_API_KEY);
require("dotenv").config();


const app = express();

const supabase =
createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.send(
        "BLACKBOX backend online."
    );

});

app.get("/test-db", async (req, res) => {

    const { data, error } =
    await supabase
    .from("users")
    .select("*");

    res.json({
        data,
        error
    });

});

app.post("/chat", async (req, res) => {

    try{

       console.log(process.env.GROQ_API_KEY);
        const response =
        await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        
        {
            method:"POST",

            headers:{
                "Content-Type":
                "application/json",

                "Authorization":
                "Bearer " +
                process.env.GROQ_API_KEY
            },

            body: JSON.stringify(
                req.body
            )

        });

        const data =
       await response.json();
       
        console.log("GROQ RESPONSE:",
            data);
        

        res.json(data);

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            error:error.message
        });

    }

});

app.listen(3000, () => {

    console.log(
        "BLACKBOX BACKEND V69 RUNNING"
    );

});