import { Request, Response, NextFunction } from "express";

import verifyUser from "../src/utils/verifyUser";

describe("verifyUser", () => {
    let mockedReq: Partial<Request>;
    let mockedRes: Partial<Response>;
    let mockedNext: NextFunction = jest.fn();

    beforeEach(() => {
        mockedReq = {
            cookies: {},
        };
        mockedRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            locals: {},
        };
    });

    it("should return 401 if no token is provided", () => {
        verifyUser(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if token is invalid", () => {
        mockedReq.cookies = {
            jwtCookie: "invalidToken",
        };
        verifyUser(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(401);
    });

    it("should call next if token is valid", () => {
        mockedReq.cookies = {
            jwtCookie:
                "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXJyeSIsImlhdCI6MTY4NjQyMDUyMywiZXhwIjoxNjg2NTA2OTIzfQ.BiG--Ywzo-sLeYQ7vF9kSwUrGkjED7cZKeZ6uzEmoOc",
        };
        mockedRes.locals = {
            user: "",
        };

        verifyUser(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedNext).toBeCalled;
    });
});
