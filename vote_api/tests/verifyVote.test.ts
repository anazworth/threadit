import verifyVote from "../src/utils/verifyVote";
import { Request, Response, NextFunction } from "express";

describe("verifyVote", () => {
    let mockedReq: Partial<Request>;
    let mockedRes: Partial<Response>;
    let mockedNext: NextFunction = jest.fn();

    beforeEach(() => {
        mockedReq = {
            body: {},
            cookies: {},
        };
        mockedRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            locals: {
                user: "curry",
            },
        };
    });

    it("should return 400 if post_id is missing", () => {
        mockedReq.body = {
            vote: 1,
        };
        verifyVote(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if vote is missing", () => {
        mockedReq.body = {
            post_id: 1,
        };
        verifyVote(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if post_id is negative", () => {
        mockedReq.body = {
            post_id: -1,
            vote: 1,
        };
        verifyVote(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if vote is not 1 or -1", () => {
        mockedReq.body = {
            post_id: 1,
            vote: 2,
        };
        verifyVote(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedRes.status).toHaveBeenCalledWith(400);
    });

    it("should call next if vote is valid", () => {
        mockedReq.body = {
            post_id: 1,
            vote: 1,
        };
        verifyVote(
            mockedReq as Request,
            mockedRes as Response,
            mockedNext as NextFunction
        );
        expect(mockedNext).toBeCalled;
    });
});
