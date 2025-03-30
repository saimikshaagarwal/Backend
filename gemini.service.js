const fs=require("fs");
const path=require("path");
const axios=require("axios");
const {GoogleGenerativeAI}=require("@google/generative-ai");
require("dotenv").config();

const knowledgeBasePath=path.join(__dirname,"faq.json");
const knowledgeBase=JSON.parse(fs.readFileSync(knowledgeBasePath,"utf-8"));
console.log("knowledgeBase");
const apiKey=process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model=genAI.getGenerativeModel({model:"gemini-2.0-flash"});


const ask=async(ChatId,message)=>{
    const lowerCaseMessage=message.toLowerCase().trim();
    if(knowledgeBase[lowerCaseMessage]){
        return {reply:knowledgeBase[lowerCaseMessage]};
    }

    try{
        const result=await model.generateContent(lowerCaseMessage);
        console.log("Response by Gemini",result);
        console.log("Response response",result.response);
        console.log(result.response.text());
        return {reply:result.response.text()};
    }

    catch(error){
        console.log("Error with Generative AI",error);
        return {reply:"sorry,there was error processing your request"};
    }
};

module.exports={ask};