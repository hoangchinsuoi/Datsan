import { Request, Response } from 'express';
import { AuthService } from '../Services/Implementations/AuthService';
import { ResponseHelper } from '../Helpers/ResponseHelper';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login(email, password);
      if (result) {
        return ResponseHelper.success(res, result, 'Login successful');
      }
      return ResponseHelper.unauthorized(res, 'Invalid credentials');
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }

  public async register(req: Request, res: Response) {
    const userData = req.body;
    try {
      const result = await this.authService.register(userData);
      return ResponseHelper.success(res, result, 'Registration successful', 201);
    } catch (error) {
      return ResponseHelper.error(res, error);
    }
  }
}
