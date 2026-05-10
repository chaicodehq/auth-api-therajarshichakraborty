import { User } from '../models/user.model.js';
import { verifyToken } from '../utils/jwt.js';

export async function authenticate(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: { message: 'No token provided' } });
		}

		const token = authHeader.split(' ')[1];

		const decoded = verifyToken(token);

		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ error: { message: 'Invalid token' } });
		}

		req.user = user;

		next();
	} catch (error) {
		return res.status(401).json({
			error: { message: 'Invalid token' },
		});
	}
}
