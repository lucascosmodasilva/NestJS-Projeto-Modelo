export class ReqUtils {
  static async getToken(req: Request): Promise<string> {
    let token = req.headers['Authorization'];
    if (!token) token = req.headers['authorization'];

    return token ? token.replace('Bearer', '').replace('bearer', '').trim() : null;
  }
}