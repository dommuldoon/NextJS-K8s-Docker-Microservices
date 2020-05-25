import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be 4-20'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		console.log('Creating a user');

		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			console.log('User exists');
			throw new BadRequestError('Email is in use');
		}
		const user = User.build({ email, password });
		await user.save();

		const userJwt = jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!
		);
		//req.session?.jwt;
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

router.get('/api/users/signup', (req, res) => {
	res.send('This is the sign in get ');
});

export { router as signupRouter };
