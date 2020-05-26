import axios from 'axios';
const LandingPage = ({ currentUser }) => {
	console.log('I am in the component', currentUser);
	return <h1>Landing Page </h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
	//console.log(req.headers);
	// const response = await axios.get(
	// 	'http://ingress-nginx.ingress.nginx.svc.cluster.local/api/users/currentuser'
	// );
	// return response.data;
	if (typeof window === 'undefined') {
		console.log('I am on the server');
		const { data } = await axios.get(
			'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
			{
				headers: req.headers,
			}
		);
		return data;
	} else {
		const { data } = await axios.get('/apis/users/currentuser');
		return data;
	}
};

export default LandingPage;
