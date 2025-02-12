const aiService = require('../services/ai.services');
module.exports.getReview = async function(req, res){

    const code = req.body.code;
    if(!code){
        return res.status(400).json({message: "Please provide a prompt for the AI to generate text."});
    }

    const response = await aiService.GoogleGenerativeAIResponse(code);

    res.send(response);

}