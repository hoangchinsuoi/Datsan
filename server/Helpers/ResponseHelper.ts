import { Response } from 'express';

export class ResponseHelper {
  public static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  public static error(res: Response, error: any, statusCode: number = 500) {
    console.error(error);
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }

  public static unauthorized(res: Response, message: string = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  public static forbidden(res: Response, message: string = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message
    });
  }

  public static notFound(res: Response, message: string = 'Not Found') {
    return res.status(404).json({
      success: false,
      message
    });
  }
}
