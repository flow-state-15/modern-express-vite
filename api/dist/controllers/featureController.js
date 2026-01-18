// this folder contains route handler functions for routes defined in ./routes.ts.
// keeps routing logic separate from handler logic.
export function handleFeature(req, res, next) {
    console.log("trying to do the thing!");
    res.send("doing the thing!");
}
//# sourceMappingURL=featureController.js.map