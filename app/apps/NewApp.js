import {
	default as React,
	Component
} from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import { appbaseService } from '../service/AppbaseService';
import {Loading} from '../others/Loading';

export class NewApp extends Component {

	constructor(props) {
		super(props);
		this.state = {
			value: '',
			height: '100px',
			validate: {
				value: false,
				error: null
			}
		};
		this.errors = {
			'duplicate': 'Duplicate app',
			'required': 'Appname is required!'
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		// var appCard = $('.apps .app-card-container');
		// var height = $(appCard[appCard.length-1]).height();
		// this.setState({
		// 	height: height+'px'
		// });
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.createAppError && nextProps.createAppError.Message) {
			if(nextProps.createAppError.Message.indexOf('duplicate') > -1) {
				this.createAppError = this.errors['duplicate'];
			} else {
				this.createAppError = nextProps.createAppError;
			}
		}
		else if(nextProps.clearInput) {
			this.setState({
				value: ''
			});
		}
	}

	validateApp(appName) {
		let validate = {
			value: true,
			error: null
		};
		this.createAppError = null;
		appName = appName.trim();
		if(!appName) {
			validate.value =  false;
			// validate.error = this.errors['required'];
		} else {
			let duplicateApp = this.props.apps.filter((app) => appName === app.name);
			if(duplicateApp && duplicateApp.length) {
				validate.value =  false;
				validate.error = this.errors['duplicate'];
			}
		}
		return validate;
	}

	handleChange(event) {
		let appName = event.target.value;
		this.setState({
			value: appName,
			validate: this.validateApp(appName)
		});
	}

	renderElement(ele) {
		let generatedEle =  null;
		switch(ele) {
			case 'helpBlock':
				if(this.state.validate.error || this.createAppError) {
					generatedEle = (<span className="help-block">{this.state.validate.error || this.createAppError}</span>);
				}
			break;
			case 'loading':
				if(this.props.createAppLoading) {
					generatedEle = (<Loading></Loading>);
				}
			break;
		}
		return generatedEle;
	}

	render() {
		let disabled = !this.state.validate.value ? {disabled: true} : null;
		return (
			<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 app-card-container">
				<div className="app-card new-app col-xs-12" style={{'height': this.state.cardHeight}}>
					<div className="app-card-progress">
						<div className="plus-icon app-card-progress-container">
							<div className="appCount">
								+
							</div>
						</div>
					</div>
					<div className={"col-xs-12 form-group "+ (this.state.validate.error ? 'has-error' : '')}>
						<input type="text" placeholder="Create new app" value={this.state.value} className="form-control" onChange={this.handleChange} />
						{this.renderElement('helpBlock')}
					</div>
					<div className="col-xs-12 title">
						<button {...disabled} className="col-xs-12 theme-btn active" onClick={() => this.props.createApp(this.state.value)} >
							{this.renderElement('loading')}
							Create a new app
						</button>
					</div>
				</div>
			</div>
		);
	}

}
