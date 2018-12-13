import React from 'react';
import { Button, Icon } from 'antd';
import { connect } from 'react-redux';
import Raven from 'raven-js';

class ErrorPage extends React.Component {
	state = {
		error: false,
	};

	componentDidUpdate(prevProps) {
		const {
			location: { pathname }, // eslint-disable-line
		} = this.props;
		if (prevProps.location.pathname !== pathname) {
			// eslint-disable-next-line
			this.setState({
				error: false,
			});
		}
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: true,
		});
		Raven.captureException(error, { extra: errorInfo });
	}

	render() {
		const { error } = this.state;
		const { children, user } = this.props; // eslint-disable-line
		return error ? (
			<section
				css={{
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					height: '80vh',
				}}
			>
				<Icon type="frown" theme="outlined" style={{ fontSize: 55, marginBottom: 10 }} />
				<h2>Something went wrong!</h2>
				<p>Our team has been notified about this.</p>
				<section
					css={{
						display: 'flex',
					}}
				>
					<Button href={user ? '/' : '/login'} size="large" type="primary">
						<Icon type={user ? 'home' : 'left'} />
						Back to {user ? 'Home' : 'Login'}
					</Button>
					<Button
						href="mailto:support@appbase.io"
						target="_blank"
						size="large"
						type="danger"
						css={{ marginLeft: '8' }}
					>
						<Icon type="info-circle" />
						Report Bug
					</Button>
				</section>
			</section>
		) : (
			children
		);
	}
}

const mapStateToProps = ({ user }) => ({
	user,
});

export default connect(
	mapStateToProps,
	null,
)(ErrorPage);
