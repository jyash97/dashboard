import React, { Component } from 'react';
import classNames from 'classnames';
import { common } from '../../shared/helper';

export default class NewShare extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			userEmail: null,
			selectedType: 'read',
			clearInput: false,
		};
		this.types = {
			read: {
				description: 'Read Access',
				read: true,
				write: false,
			},
			admin: {
				description: 'Read-Write Access',
				read: true,
				write: true,
			},
		};
		this.newShare = this.newShare.bind(this);
		this.expand = this.expand.bind(this);
		this.updateUserEmail = this.updateUserEmail.bind(this);
		this.onSelect = this.onSelect.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.description) {
			this.setState({
				description: this.props.description,
			});
		}
		if (nextProps.newShareExpand !== this.newShareExpand) {
			this.newShareExpand = nextProps.newShareExpand;
			if (this.newShareExpand) {
				this.expand();
			}
		}
	}
	newShare() {
		const request = JSON.parse(JSON.stringify(this.types[this.state.selectedType]));
		request.email = this.state.userEmail;
		request.user = this.state.userEmail;
		request.description += '(shared with ' + this.state.userEmail + ')';
		this.props.newShare(request);
		this.expand();
	}
	expand() {
		this.setState({
			show: !this.state.show,
			clearInput: true,
		});
	}
	updateUserEmail(email) {
		if (email !== this.state.userEmail) {
			this.setState({
				userEmail: email,
				clearInput: false,
			});
		}
	}
	onSelect(selectedType) {
		this.setState({
			selectedType,
		});
	}
	renderElement(method) {
		let element = null;
		switch (method) {
			case 'email':
				element = (
					<div className="col-xs-12 ad-create-email">
						<UserEmail
							updateUserEmail={this.updateUserEmail}
							clearInput={this.state.clearInput}
						/>
					</div>
				);
				break;
			case 'buttonGroup':
				element = (
					<span className="ad-create-button-group without-margin col-xs-9">
						{Object.keys(this.types).map((type, index) => {
							return (
								<ShareButton
									key={index}
									type={type}
									selectedType={this.state.selectedType}
									description={this.types[type].description}
									onSelect={this.onSelect}
									userEmail={this.state.userEmail}
								/>
							);
						})}
					</span>
				);
				break;
		}
		return element;
	}
	render() {
		const cx = classNames({
			active: this.state.show,
		});
		return (
			<div className={`ad-create col-xs-12 ${cx}`}>
				<div className="ad-create-collapse">
					<a className="ad-theme-btn primary" onClick={this.expand}>
						Add Team Member
					</a>
				</div>
				<div className="ad-create-expand row">
					<div className="flex flex-column">
						{this.renderElement('email')}
						<div className="ad-create-button-group-container">
							{this.renderElement('buttonGroup')}
						</div>
					</div>
					<div className="col-xs-8 col-sm-3">
						<button
							{...common.isDisabled(!this.state.userEmail)}
							className="ad-theme-btn primary ad-create-submit"
							onClick={this.newShare}
						>
							Share
						</button>
					</div>
				</div>
			</div>
		);
	}
}

class UserEmail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userEmail: '',
		};
		this.handleInput = this.handleInput.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.clearInput) {
			this.setState(
				{
					userEmail: '',
				},
				() => {
					$(this.emailRef).trigger('focus');
				},
			);
		}
	}
	handleInput(event) {
		this.setState(
			{
				userEmail: event.target.value,
			},
			this.validateEmail,
		);
	}
	validateEmail() {
		if (this.isValidEmail(this.state.userEmail)) {
			this.props.updateUserEmail(this.state.userEmail);
		} else {
			this.props.updateUserEmail(null);
		}
	}
	isValidEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	render() {
		return (
			<input
				ref={input => (this.emailRef = input)}
				type="text"
				placeholder="Type email.."
				className="form-control"
				value={this.state.userEmail}
				onChange={this.handleInput}
			/>
		);
	}
}

const ShareButton = props => {
	return (
		<label className="radio-inline">
			<input
				type="radio"
				name={props.type}
				checked={props.selectedType === props.type}
				onChange={props.onSelect && (() => props.onSelect(props.type))}
			/>{' '}
			{props.description}
			<span className="checkmark" />
		</label>
	);
};
