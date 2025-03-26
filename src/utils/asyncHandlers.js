

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};




export default asyncHandler;







/*const asynchandler=(fn)=> async(req,res,next)=>{
    tru{
        catch (error){
            res.ststus(error.code ||500).json({
                success
            })
        }
    }
}*/