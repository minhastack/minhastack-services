module.exports = async (req, res) => {
    try{
        let pensador = require("pensador-api");
        let queryTerm = req.query.term;
        let maxTerm = req.query.max || 0;
        let resData = await pensador({ term: queryTerm, max:  maxTerm});
        res.send(resData)
    } catch(e){
        res.send({error: e.toString()})
    }
}