import React, { Component } from 'react';
import { Circle } from 'rc-progress';
import classNames from 'classnames';
import NewApp from './components/NewApp';
import ActionButtons from './components/ActionButtons';
import AppCard from './components/AppCard';
import { appbaseService } from '../../service/AppbaseService';
import { billingService } from '../../service/BillingService';
import { appListHelper, common, intercomService } from '../../shared/helper';
import { AppOwner } from '../../shared/SharedComponents';
import SortBy from './components/SortBy';
import FilterByAppname from './components/FilterByAppname';
import FilterByOwner from './components/FilterByOwner';
import Upgrade from './components/Upgrade';
import config from '../../config';
import UserInfo from '../../shared/UserInfo';
import get from 'lodash/get';

const moment = require('moment');

const AppIntro = props => (
	<AppCard {...props} setClassName="col-md-6">
		<h3 className="title name">Hi {props.name ? props.name.split(' ')[0] : null},</h3>
		<p className="description">
			This is your apps manager view. Here, you can create a new app and manage your existing
			apps.
		</p>
	</AppCard>
);

const AppTutorial = props => (
	<AppCard style={{ textAlign: 'center' }} {...props} setClassName="col-md-3">
		<h3 className="title quick-links">Quick Links</h3>
		{config.quickLinks}
	</AppCard>
);

export default class AppList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apps: [],
			plan: 'free',
			createAppLoading: false,
			createAppError: null,
			clearInput: false,
			loading: true,
			showShared: appbaseService.getShareApps(),
		};
		this.themeColor = config.accent;
		this.trailColor = '#eee';
		this.createApp = this.createApp.bind(this);
		this.deleteApp = this.deleteApp.bind(this);
		this.registerApps = this.registerApps.bind(this);
		this.toggleShared = this.toggleShared.bind(this);
		this.config = config;
	}

	componentWillMount() {
		this.stopUpdate = false;
		if (appbaseService.userInfo) {
			this.initialize();
		} else {
			appbaseService.pushUrl();
		}
	}

	deleteApp(selectedApp) {
		appbaseService
			.deleteApp(selectedApp.id)
			.then((data) => {
				const apps = this.state.apps.filter(app => app.id !== selectedApp.id);
				appbaseService.preservedApps = appbaseService.preservedApps.filter(app => app.id !== selectedApp.id,);
				if (appbaseService.preservedApps.length === 0) {
					appbaseService.pushUrl('/tutorial');
				}
				this.setState({
					apps,
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}

	componentWillUnmount() {
		this.stopUpdate = true;
	}

	initialize() {
		this.setSort = true;
		this.getBillingInfo();
		this.getApps();
	}

	getApps() {
		appbaseService
			.allApps()
			.then((data) => {
				const apps = data.body;
				appbaseService.setPreservedApps(apps);
				this.registerApps(apps, true);
			})
			.catch((e) => {
				console.log(e);
				appbaseService.pushUrl('/login');
			});
	}

	registerApps(apps, getInfo = false) {
		if (
			appbaseService.preservedApps.length === 0 &&
			!appbaseService.filterAppName.trim().length
		) {
			// appbaseService.pushUrl('/tutorial'); skip to show user info first
		} else {
			this.setState(
				{
					apps,
				},
				() => {
					if (getInfo) {
						this.getAppInfo.call(this);
					}
				},
			);
		}
	}

	getBillingInfo() {
		if (
			appbaseService.userInfo &&
			appbaseService.userInfo.body &&
			appbaseService.userInfo.body.c_id
		) {
			const requestData = {
				c_id: appbaseService.userInfo.body.c_id,
			};
			billingService
				.getCustomer(requestData)
				.then((data) => {
					const plan =
						Object.keys(billingService.planLimits).indexOf(data.plan) > -1
							? data.plan
							: 'free';
					this.setState({
						billingInfo: data,
						plan,
					});
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}

	calcPercentage(app, field) {
		const count =
			field === 'action'
				? app && app.api_calls
					? app.api_calls
					: 0
				: app && app.records
					? app.records
					: 0;
		let percentage = (100 * count) / billingService.planLimits[this.state.plan][field];
		percentage = percentage < 100 ? percentage : 100;
		return {
			percentage,
			count,
		};
	}

	getAppInfo() {
		let apps = this.state.apps;
		appbaseService
			.allMetrics()
			.then((data) => {
				apps = apps.map(app => Object.assign(app, data.body[app.id]));
				apps = appbaseService.applySort(apps, appbaseService.sortBy.field);
				apps = appbaseService.filterBySharedApps();
				this.registerApps(apps);
				this.setIntercomData(data.body);
				this.setState({ loading: false });
			})
			.catch((e) => {
				console.log(e);
			});
		appbaseService
			.allPermissions()
			.then((data) => {
				apps = apps.map(app =>
					Object.assign(app, appListHelper.filterPermissions(data.body[app.id])),);
				this.registerApps(apps);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	setIntercomData(metrics) {
		const userInfo = {
			email: appbaseService.userInfo.body.email,
			calls: 0,
			records: 0,
			apps: Object.keys(metrics).length,
			[config.name]: true,
		};
		Object.keys(metrics).forEach((item) => {
			userInfo.calls += metrics[item].api_calls;
			userInfo.records += metrics[item].records;
		});
		intercomService.update(userInfo);
	}

	updateApps(apps) {
		if (!this.stopUpdate) {
			this.setState({ apps });
			appbaseService.setExtra('allApps', apps);
		}
	}

	createApp(appData) {
		appbaseService
			.createApp(appData)
			.then((data) => {
				this.setState({
					createAppLoading: false,
					clearInput: true,
				});
				appbaseService.pushUrl(`/dashboard/${appData.appname}`);
			})
			.catch((e) => {
				this.setState({
					createAppError: e.responseJSON,
					createAppLoading: false,
				});
				console.log(e);
			});
	}

	timeAgo(app) {
		return app && app.lastAciveOn ? moment(app.lastAciveOn).fromNow() : null;
	}

	isShared(app) {
		return !!(
			app &&
			appbaseService &&
			appbaseService.userInfo &&
			appbaseService.userInfo.body &&
			app.owner !== appbaseService.userInfo.body.email
		);
	}

	toggleShared() {
		const { showShared } = this.state;
		this.setState({
			showShared: !showShared,
		});
	}

	renderElement(ele) {
		let generatedEle = null;
		switch (ele) {
			case 'apps': {
				const apps = this.state.apps.filter(app =>
						(this.state.showShared
							? true
							: app.owner === appbaseService.userInfo.body.email),);
				// in order to figure out a way around localstorage update logic

				generatedEle = apps.map((app) => {
					const appCount = {
						action: this.calcPercentage(app, 'action'),
						records: this.calcPercentage(app, 'records'),
					};
					const cx = classNames({
						'with-owner': this.isShared(app),
					});
					return (
						<AppCard key={app.id} setClassName="col-md-4">
							<div
								className="ad-list-app"
								onClick={() => {
									window.sessionStorage.setItem('currentCalls', app.api_calls);
									window.sessionStorage.setItem('currentRecords', app.records);
									appbaseService.pushUrl(`/dashboard/${app.appname}`);
								}}
							>
								<span className="ad-list-app-bg-container">
									<i className="ad-list-app-bg" />
								</span>
								<div className="ad-list-app-content">
									<header className={`ad-list-app-header ${cx}`}>
										<div className="ad-list-title-container">
											<AppOwner app={app} />
											<h3 className="title">{app.appname}</h3>
										</div>
									</header>
									<div className="description">
										<div className="row clearfix ad-metrics-summary">
											<div className="col-xs-6">
												<div className="col-xs-12 p-0 progress-container">
													<span className="progress-wrapper">
														{this.state.loading ? (
															<div className="animated-spinner">
																<i className="fas fa-circle-notch fa-spin" />
															</div>
														) : (
															<Circle
																percent={appCount.action.percentage}
																strokeWidth="10"
																trailWidth="10"
																trailColor={this.trailColor}
																strokeColor={this.themeColor}
															/>
														)}
													</span>
													<div className="progress-text">
														<div className="sub-title">API calls</div>
														{this.state.loading ? (
															<div>Loading...</div>
														) : (
															<div>
																<strong>
																	{common.compressNumber(appCount.action.count,)}
																</strong>&nbsp;/&nbsp;
																<span>
																	{common.compressNumber(billingService.planLimits[
																			this.state.plan
																		].action,)}
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
											<div className="col-xs-6">
												<div className="col-xs-12 p-0 progress-container">
													<span className="progress-wrapper">
														{this.state.loading ? (
															<div className="animated-spinner">
																<i className="fas fa-circle-notch fa-spin" />
															</div>
														) : (
															<Circle
																percent={
																	appCount.records.percentage
																}
																strokeWidth="10"
																trailWidth="10"
																trailColor={this.trailColor}
																strokeColor={this.themeColor}
															/>
														)}
													</span>
													<div className="progress-text">
														<div className="sub-title">Records</div>
														{this.state.loading ? (
															<div>Loading...</div>
														) : (
															<div>
																<strong>
																	{common.compressNumber(appCount.records.count,)}
																</strong>&nbsp;/&nbsp;
																<span>
																	{common.compressNumber(billingService.planLimits[
																			this.state.plan
																		].records,)}
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
									<ActionButtons app={app} deleteApp={this.deleteApp} />
								</div>
							</div>
						</AppCard>
					);
				});
				break;
			}
			default:
				break;
		}
		return generatedEle;
	}

	render() {
		if (
			new Date(appbaseService.profileCheckDate) <
				new Date(get(appbaseService.userInfo, ['body', 'created_at'])) &&
			get(appbaseService.userInfo, ['body', 'deployment-timeframe']) === ''
		) {
			return (
				<UserInfo
					description="While we're creating your account, can you take a minute to answer these questions?"
					forceUpdate={() => appbaseService.pushUrl('/tutorial')}
				/>
			);
		}
		return (
			<div className="ad-list">
				{appbaseService.userInfo ? (
					<div>
						<header className="ad-list-header row">
							<div className="container flexcontainer">
								<AppIntro
									setClassName="hidden-xs"
									name={appbaseService.userInfo.body.details.name}
								/>
								<AppTutorial setClassName="hidden-xs hidden-sm" />
								<NewApp
									createApp={this.createApp}
									apps={this.state.apps}
									createAppLoading={this.state.createAppLoading}
									createAppError={this.state.createAppError}
									clearInput={this.state.clearInput}
								/>
							</div>
						</header>
						<div className="ad-list-container container">
							<Upgrade apps={this.state.apps} plan={this.state.plan} />
							<div className="ad-list-filters col-xs-12 p-0 text-right">
								<SortBy apps={this.state.apps} registerApps={this.registerApps} />
								<FilterByAppname registerApps={this.registerApps} />
								<FilterByOwner
									registerApps={this.registerApps}
									toggleShared={this.toggleShared}
								/>
							</div>
							<div
								style={{ width: 'calc(100% + 30px)' }}
								className="ad-list-apps row clearfix"
							>
								{this.renderElement('apps')}
							</div>
						</div>
					</div>
				) : null}
			</div>
		);
	}
}
