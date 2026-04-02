/*eslint-disable*/

import { Request } from "express";

export interface JwtPayloadCustom {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: number;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}
