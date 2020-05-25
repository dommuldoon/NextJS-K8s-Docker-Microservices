import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').trim().notEmpty().withMessage('You must supply password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			console.log('User exists fff');
			throw new BadRequestError('Invalid credentials user');
		}
		console.log('existingUser', existingUser);
		console.log('pass1', password);
		console.log('pass2', existingUser.password);

		const passwordsMatch = await Password.compare(existingUser.password, password);
		if (!passwordsMatch) {
			console.log('no pass');
			throw new BadRequestError('Invalid credentials pass');
		}
		const userJwt = jwt.sign(
			{
				id: existingUser.id,
				email: existingUser.email,
			},
			process.env.JWT_KEY!
		);
		//req.session?.jwt;
		req.session = {
			jwt: userJwt,
		};

		res.status(200).send(existingUser);
	}
);

router.get('api/users/signin', (req, res) => {
	res.send('This is the sign in get ');
});

export { router as signinRouter };
