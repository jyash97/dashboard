import React, { Component } from 'react';
import get from 'lodash/get';
import { appbaseService } from '../../service/AppbaseService';
import { getMappings } from './../../../modules/batteries/utils/mappings';
import { getCredentials, checkUserStatus } from './../../../modules/batteries/utils';
import PermissionCard from './PermissionCard';
import NewPermission from './NewPermission';
import AppPage from '../../shared/AppPage';
import Loader from './../../shared/Loader';
import DeleteApp from './DeleteApp';

export default class Credentials extends Component {
	constructor(props) {
		super(props);
		this.state = {
			info: null,
			isLoading: true,
			plan: undefined,
			isSubmitting: false,
			showCredForm: false,
			isPaidUser: false,
			mappings: {},
			currentPermissionInfo: undefined,
		};
		this.getInfo = this.getInfo.bind(this);
		this.newPermission = this.newPermission.bind(this);
	}

	componentWillMount() {
		this.stopUpdate = false;
		this.initialize(this.props);
	}
	componentDidMount() {
		checkUserStatus().then(
			(response) => {
				this.setState({
					isPaidUser: response.isPaidUser,
					plan: response.plan,
					isLoading: false,
				});
			},
			(error) => {
				this.setState(
					{
						isLoading: false,
					},
					() =>
						toastr.error(
							'Error',
							get(error, 'responseJSON.message', 'Something went wrong'),
						),
				);
			},
		);
		if (this.props.params.appId) {
			const appId = appbaseService.userInfo.body.apps[this.props.params.appId];
			getCredentials(appId)
				.then((user) => {
					const { username, password } = user;
					return getMappings(this.appName, `${username}:${password}`);
				})
				.then((res) => {
					this.setState({
						mappings: res,
					});
				})
				.catch((error) => {
					toastr.error('Error', 'Unable to fetch mappings');
				});
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.params.appId !== this.appName) {
			this.initialize(nextProps);
		}
	}
	componentWillUnmount() {
		this.stopUpdate = true;
	}
	getInfo() {
		this.info = {};
		appbaseService.getPermission(this.appId).then((data) => {
			this.info.permission = data;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
		appbaseService.getAppInfo(this.appId).then((data) => {
			this.info.appInfo = data.body;
			if (!this.stopUpdate) {
				this.setState({ info: this.info });
			}
		});
	}
	initialize(props) {
		this.appName = props.params.appId;
		this.appId = appbaseService.userInfo.body.apps[this.appName];
		this.getInfo();
	}
	handleCancel = () => {
		this.setState({
			showCredForm: false,
		});
	};
	newPermission(request) {
		this.setState(
			{
				isSubmitting: true,
			},
			() => {
				appbaseService.newPermission(this.appId, request).then(
					() => {
						this.getInfo();
						this.setState({
							isSubmitting: false,
							showCredForm: false,
						});
					},
					(e) => {
						toastr.error(
							'Error',
							get(e, 'responseJSON.message', 'Unable to save credentials'),
						);
						this.setState({
							isSubmitting: false,
						});
					},
				);
			},
		);
	}
	updatePermission = (request, username) => {
		this.setState(
			{
				isSubmitting: true,
			},
			() => {
				appbaseService.updatePermission(this.appId, username, request).then(
					() => {
						this.getInfo();
						this.setState({
							isSubmitting: false,
							showCredForm: false,
						});
					},
					(e) => {
						toastr.error(
							'Error',
							get(e, 'responseJSON.message', 'Unable to save credentials'),
						);
						this.setState({
							isSubmitting: false,
						});
					},
				);
			},
		);
	};

	isOwner() {
		return (
			this.state.info &&
			this.state.info.appInfo &&
			this.state.info.appInfo.owner === appbaseService.userInfo.body.email
		);
	}
	showForm = (permissionInfo) => {
		if (permissionInfo) {
			this.setState({
				showCredForm: true,
				currentPermissionInfo: permissionInfo,
			});
		} else {
			this.setState({
				showCredForm: true,
				currentPermissionInfo: undefined,
			});
		}
	};
	renderElement(method) {
		let element = null;
		switch (method) {
			case 'permissions':
				if (this.state.info && this.state.info.permission) {
					element = this.state.info.permission.body
						.sort((a, b) => {
							const first = a.description;
							const second = b.description;
							if (first < second) {
								return -1;
							} else if (first > second) {
								return 1;
							}
							return 0;
						})
						.map((permissionInfo, index) => (
							<PermissionCard
								appId={this.appId}
								key={index}
								isOwner={this.isOwner()}
								permissionInfo={permissionInfo}
								isPaidUser={this.state.isPaidUser}
								mappings={this.state.mappings}
								getInfo={this.getInfo}
								showForm={this.showForm}
							/>
						));
				}
				break;
			case 'deleteApp':
				if (this.isOwner()) {
					element = (
						<footer className="ad-detail-page-body other-page-body col-xs-12 delete-app-body">
							<div className="page-body col-xs-12">
								<section className="col-xs-12 p-0">
									<div className="col-xs-12 p-0">
										<DeleteApp appName={this.appName} appId={this.appId} />
									</div>
								</section>
							</div>
						</footer>
					);
				}
				break;
			default:
		}
		return element;
	}
	render() {
		if (this.state.isLoading) {
			return <Loader />;
		}
		return (
			<AppPage
				pageInfo={{
					currentView: 'credentials',
					appName: this.appName,
					appId: this.appId,
				}}
			>
				<div id="permission-page" className="ad-detail-page ad-dashboard row">
					<div className="ad-detail-page-body col-xs-12">
						<div className="page-body col-xs-12">
							<section className="ad-detail-page-body-card col-xs-12 p-0">
								<div className="ad-detail-page-body-card-body col-xs-12 p-0">
									{this.renderElement('permissions')}
									<NewPermission
										appId={this.props.params.appId}
										appName={this.appName}
										isSubmitting={this.state.isSubmitting}
										newPermission={this.newPermission}
										updatePermission={this.updatePermission}
										showForm={this.showForm}
										showCredForm={this.state.showCredForm}
										handleCancel={this.handleCancel}
										isPaidUser={this.state.isPaidUser}
										plan={this.state.plan}
										isOwner={this.isOwner()}
										mappings={this.state.mappings}
										initialValues={this.state.currentPermissionInfo}
									/>
								</div>
							</section>
						</div>
					</div>
					{this.renderElement('deleteApp')}
				</div>
			</AppPage>
		);
	}
}
