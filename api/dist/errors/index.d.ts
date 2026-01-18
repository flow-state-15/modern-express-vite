import type { Request, Response, NextFunction } from "express";
export declare function genericServerError(err: unknown, req: Request, res: Response, next: NextFunction): void;
export declare function apiNotFound(req: Request, res: Response): void;
export declare function spaFallback(req: Request, res: Response): void;
//# sourceMappingURL=index.d.ts.map