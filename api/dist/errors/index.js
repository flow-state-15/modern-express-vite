// catch-alls for generic error handling
// organize and segregate for complex error handling scenarios
import path from "path";
import { getDistPath } from "../utils/index.js";
// 500 fallback
export function genericServerError(err, req, res, next) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error", error: err });
}
;
// /api 404s
export function apiNotFound(req, res) {
    res.status(404).json({ error: "Not Found" });
}
;
// spa fallback for frontend routing
export function spaFallback(req, res) {
    res.sendFile(path.join(getDistPath(), "index.html"));
}
;
//# sourceMappingURL=index.js.map