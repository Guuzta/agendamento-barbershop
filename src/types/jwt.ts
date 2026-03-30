/*eslint-disable*/

import { Request } from "express";

export interface JwtPayloadCustom {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest<P = {}> extends Request {
  userId?: number;
  userName?: string;
  userEmail?: string;
  userRole?: string;
}
