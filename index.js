const PORT = process.env.PORT || 8000;

const express = require('express');

const app= express();
const version = "1.0.3";
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/", (req,res) => {
    response= { 
        success: true, 
        name: "CodegenAPI",
        author: "Guglielmo Tarchi",
        message: "Welcome to codegenAPI", 
        version: version
    };
    res.status(200).json(response);
})

/*
{
	"size" : 10,
	"type": [
		"numbers",
		"uppercase",
        "lowercase"
	]
}
*/
app.post("/generate", (req,res) => {
    const size = req.body.size;
    const type = req.body.type;//[]
    responseError = { success: false, error: ""};
    if (size != undefined){
        if(type != undefined && Array.isArray(type) && type.length!=0){
            if(size >= type.length){
                const regexp = defineRegexp(type);
                if(regexp!=null){
                    var code = "";
                    var testerRegexp = new RegExp(regexp);
                    var count = 0;
                    var valid = false;
                    do{
                        code = makeCode(size,type);
                        valid = testerRegexp.test(code);
                        count++;
                    }while(!valid && count<=99999);
                    if(count>99999){
                        responseError.error = "impossible to create this password";
                        res.status(500).json(responseError);
                    }
                    else{
                        response = {success: true, size : req.body.size, code: code};
                        responseError = { success: false, error: ""};
                        res.status(200).json(response);
                    }
                }else{
                    responseError.error = "type not evaluated correctly, error in regexp";
                    res.status(400).json(responseError);
                }
            }else{
                responseError.error = "size MUST be longer than the quantity of types";
                res.status(400).json(responseError);
            }
        }
        else{
            responseError.error = "type not evaluated correctly";
            res.status(400).json(responseError);
        }
    }else{
        responseError.error = "size not evaluated correctly";
        res.status(400).json(responseError);
    }
    //res.json("length_received",req.params.length);
})


app.listen(PORT, () => console.log("CODEGEN - Running on port "+PORT));

function makeCode(size, type){
    const numbers = "0123456789";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const symbols = "@$!%*?&";
    var characters = "";
    for(var i=0;i<type.length;i++){
        switch(type[i]){
            case "numbers": characters += numbers; break;
            case "uppercase": characters += uppercase; break;
            case "lowercase": characters += lowercase; break;
            case "symbols": characters += symbols; break;
        }
    }

    var result = '';
    var charactersLength = characters.length;
    for ( var i = 0; i < size; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function defineRegexp(type){
    var numbers = false;
    var uppercase = false;
    var lowercase = false;
    var symbols = false;
    var regexp = "";
    for(var i=0;i<type.length;i++){
        switch(type[i]){
            case "numbers": numbers = true; break;
            case "uppercase": uppercase = true; break;
            case "lowercase": lowercase = true; break;
            case "symbols": symbols = true; break;
        }
    }

    if(numbers && uppercase && lowercase && symbols){
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].{0,}$";
        return regexp;
    }
    if(numbers && uppercase && lowercase){
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d].{0,}$";
        return regexp;
    }
    if(symbols && uppercase && lowercase){
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&].{0,}$";
        return regexp;
    }
    if(symbols && uppercase && numbers){
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Z\\d@$!%*?&].{0,}$";
        return regexp;
    }
    if(symbols && lowercase && numbers){
        regexp = "^(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[a-z\\d@$!%*?&].{0,}$";
        return regexp;
    }
    if(uppercase && lowercase){
        regexp = "^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z].{0,}$";
        return regexp;
    }
    if(uppercase && symbols){
        regexp = "^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Z@$!%*?&].{0,}$";
        return regexp;
    }
    if(uppercase && numbers){
        regexp = "^(?=.*[A-Z])(?=.*\\d)[A-Z\\d].{0,}$";
        return regexp;
    }
    if(lowercase && symbols){
        regexp = "^(?=.*[a-z])(?=.*[@$!%*?&])[a-z@$!%*?&].{0,}$";
        return regexp;
    }
    if(lowercase && numbers){
        regexp = "^(?=.*[a-z])(?=.*\\d)[a-z\\d].{0,}$";
        return regexp;
    }
    if(symbols && numbers){
        regexp = "^(?=.*\\d)(?=.*[@$!%*?&])[\\d@$!%*?&].{0,}$";
        return regexp;
    }
    if(uppercase){
        regexp = "^(?=.*[A-Z])[A-Z].{0,}$";
        return regexp;
    }
    if(lowercase){
        regexp = "^(?=.*[a-z])[a-z].{0,}$";
        return regexp;
    }
    if(numbers){
        regexp = "^(?=.*\\d)[\\d].{0,}$";
        return regexp;
    }
    if(symbols){
        regexp = "^(?=.*[@$!%*?&])[@$!%*?&].{0,}$";
        return regexp;
    }

    return null;
}
