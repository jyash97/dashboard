import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { getClusterData, deployCluster, deleteCluster } from './utils';
import { regions } from './index';
import { machineMarks } from './new';
import CredentialsBox from './components/CredentialsBox';
import ErrorModal from '../../../modules/batteries/components/Mappings/ErrorModal';

export default class Clusters extends Component {
	constructor(props) {
		super(props);

		this.state = {
			cluster: null,
			deployment: null,
			kibana: false,
			logstash: false,
			elasticsearch: false,
			mirage: false,
			error: '',
			deploymentError: '',
			showError: false,
			loadingError: false,
		};
	}

	componentDidMount() {
		this.init();
	}

	getFromPricing = (plan, key) => {
		const selectedPlan = Object.values(machineMarks)
			.find(item => item.label === plan);

		return (selectedPlan ? selectedPlan[key] : '-') || '-';
	}

	setConfig = (type, value) => {
		this.setState({
			[type]: value,
		});
	}

	init = () => {
		getClusterData(this.props.routeParams.id)
			.then((res) => {
				this.originalCluster = res;
				const { cluster, deployment } = res;
				if (cluster && deployment) {
					this.setState({
						cluster,
						deployment,
						kibana: deployment.kibana
							? !!Object.keys(deployment.kibana).length
							: false,
						logstash: deployment.logstash
							? !!Object.keys(deployment.logstash).length
							: false,
						elasticsearch: deployment.elasticsearch
							? !!Object.keys(deployment.elasticsearch).length
							: false,
						mirage: deployment.mirage
							? !!Object.keys(deployment.mirage).length
							: false,
					});

					if (cluster.status === 'in progress') {
						setTimeout(this.init, 30000);
					}
				} else {
					this.setState({
						loadingError: true,
					});
				}
			})
			.catch((e) => {
				this.setState({
					error: e,
				});
			});
	}

	toggleConfig = (type) => {
		this.setState(state => ({
			...state,
			[type]: !state[type],
		}));
	}

	includedInOriginal = (key) => {
		const original = this.originalCluster.deployment;
		return original[key] ? !!Object.keys(original[key]).length : false;
	}

	deleteCluster = () => {
		deleteCluster(this.props.routeParams.id)
			.then(() => {
				browserHistory.push('/clusters');
			})
			.catch((e) => {
				this.setState({
					deploymentError: e,
					showError: true,
				});
			});
	}

	saveClusterSettings = () => {
		const body = {
			remove_deployments: [],
		};

		if (this.state.kibana && !this.includedInOriginal('kibana')) {
			body.kibana = {
				create_node: false,
				version: this.state.cluster.es_version,
			};
		} else if (!this.state.kibana && this.includedInOriginal('kibana')) {
			body.remove_deployments = [...body.remove_deployments, 'kibana'];
		}

		if (this.state.logstash && !this.includedInOriginal('logstash')) {
			body.logstash = {
				create_node: false,
				version: this.state.cluster.es_version,
			};
		} else if (!this.state.logstash && this.includedInOriginal('logstash')) {
			body.remove_deployments = [...body.remove_deployments, 'logstash'];
		}

		if (this.state.dejavu && !this.includedInOriginal('dejavu')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'dejavu',
					image: 'appbaseio/dejavu:1.5.0',
					exposed_port: 1358,
				},
			];
		} else if (!this.state.dejavu && this.includedInOriginal('dejavu')) {
			body.remove_deployments = [...body.remove_deployments, 'dejavu'];
		}

		if (this.state.mirage && !this.includedInOriginal('mirage')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'mirage',
					image: 'appbaseio/mirage:0.8.0',
					exposed_port: 3030,
				},
			];
		} else if (!this.state.mirage && this.includedInOriginal('mirage')) {
			body.remove_deployments = [...body.remove_deployments, 'mirage'];
		}

		if (this.state.elasticsearch && !this.includedInOriginal('elasticsearch')) {
			body.addons = body.addons || [];
			body.addons = [
				...body.addons,
				{
					name: 'elasticsearch-hq',
					image: 'elastichq/elasticsearch-hq:release-v3.4.0',
					exposed_port: 5000,
				},
			];
		} else if (!this.state.elasticsearch && this.includedInOriginal('elasticsearch')) {
			body.remove_deployments = [...body.remove_deployments, 'elasticsearch'];
		}

		deployCluster(body, this.props.routeParams.id)
			.then(() => {
				browserHistory.push('/clusters');
			})
			.catch((e) => {
				this.setState({
					deploymentError: e,
					showError: true,
				});
			});
	}

	hideErrorModal = () => {
		this.setState({
			showError: false,
			deploymentError: '',
		});
	}

	renderClusterRegion = (region) => {
		if (!region) return null;

		const { name, flag } = regions[region];
		return (
			<div className="region-info">
				<img src={`/assets/images/flags/${flag}`} alt="US" />
				<span>{name}</span>
			</div>
		);
	}

	renderClusterEndpoint = (source) => {
		if (Object.keys(source).length) {
			const username = source.username || source.dashboard_username;
			const password = source.password || source.dashboard_password;
			const [protocol, url] = (source.url || source.dashboard_url).split('://');
			return (
				<div key={source.name} className="cluster-endpoint">
					<h4>
						<a
							href={`${protocol}://${username}:${password}@${url}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fas fa-external-link-alt" />
							{source.name}
						</a>
					</h4>
					<CredentialsBox name={source.name} text={`${username}:${password}`} />
				</div>
			);
		}

		return null;
	}

	renderErrorScreen = () => (
		<section
			className="cluster-container container"
			style={{ textAlign: 'center', paddingTop: 40 }}
		>
			<article>
				<h2>Some error occurred</h2>
				<p>{this.state.error}</p>
				<div style={{ marginTop: 30 }}>
					<button
						className="ad-theme-btn"
						onClick={() => browserHistory.push('/clusters')}
					>
						<i className="fas fa-arrow-left" />
						&nbsp; &nbsp; Go Back
					</button>

					<button
						className="ad-theme-btn"
						onClick={this.deleteCluster}
						style={{
							marginLeft: 12,
							color: 'tomato',
						}}
					>
						Delete Cluster &nbsp; &nbsp;
						<i className="fas fa-trash-alt" />
					</button>
				</div>
			</article>
		</section>
	)

	render() {
		const vcenter = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			height: 'calc(100vh - 200px)',
			width: '100%',
			fontSize: '20px',
			textAlign: 'center',
			lineHeight: '36px',
		};

		if (this.state.error) {
			return this.renderErrorScreen();
		}

		if (!this.state.cluster) {
			if (this.state.loadingError) {
				return (
					<div style={vcenter}>
						Cluster status isn{"'"}t available yet
						<br />
						It typically takes 15-30 minutes before a cluster comes live.

						<div style={{ marginTop: 20 }}>
							<button
								className="ad-theme-btn"
								onClick={() => browserHistory.push('/clusters')}
							>
								<i className="fas fa-arrow-left" />
								&nbsp; &nbsp; Go Back
							</button>

							<button
								className="ad-theme-btn"
								onClick={this.deleteCluster}
								style={{
									marginLeft: 12,
									color: 'tomato',
								}}
							>
								Delete Cluster &nbsp; &nbsp;
								<i className="fas fa-trash-alt" />
							</button>
						</div>
					</div>
				)
			}
			return (
				<div style={vcenter}>
					Loading cluster data...
				</div>
			);
		}

		return (
			<section className="cluster-container container">
				<ErrorModal
					show={this.state.showError}
					message={this.state.deploymentError}
					onClose={this.hideErrorModal}
				/>
				<article>
					<h2>
						{this.state.cluster.name}
						<span className="tag">
							{
								this.state.cluster.status === 'delInProg'
									? 'Deletion in progress'
									: this.state.cluster.status
							}
						</span>
					</h2>

					<ul className="clusters-list">
						<li key={this.state.cluster.name} className="cluster-card compact">

							<div className="info-row">
								<div>
									<h4>Region</h4>
									{this.renderClusterRegion(this.state.cluster.region)}
								</div>

								<div>
									<h4>Pricing Plan</h4>
									<div>{this.state.cluster.pricing_plan}</div>
								</div>

								<div>
									<h4>ES Version</h4>
									<div>{this.state.cluster.es_version}</div>
								</div>

								<div>
									<h4>Memory</h4>
									<div>
										{
											this.getFromPricing(
												this.state.cluster.pricing_plan,
												'memory',
											)
										} GB
									</div>
								</div>

								<div>
									<h4>Disk Size</h4>
									<div>
										{
											this.getFromPricing(
												this.state.cluster.pricing_plan,
												'storage',
											)
										} GB
									</div>
								</div>

								<div>
									<h4>Nodes</h4>
									<div>{this.state.cluster.total_nodes}</div>
								</div>
							</div>
						</li>

						{
							this.state.cluster.status === 'in progress'
								? null
								: (
									<li className="card">
										<div className="col light">
											<h3>Dashboard</h3>
											<p>Manage your cluster</p>
										</div>

										<div className="col">
											{this.renderClusterEndpoint(this.state.cluster)}
										</div>
									</li>
								)
						}

						{
							this.state.cluster.status === 'in progress'
								? null
								: (
									<li className="card">
										<div className="col light">
											<h3>Endpoints</h3>
											<p>Plug-ins and Add-ons</p>
										</div>

										<div className="col">
											{
												Object.keys(this.state.deployment)
													.filter(item => item !== 'addons')
													.map(key => this.renderClusterEndpoint(this.state.deployment[key]))
											}
										</div>
									</li>
								)
						}

						{
							this.state.cluster.status === 'in progress'
								? null
								: (
									<li className="card">
										<div className="col light">
											<h3>Edit Cluster Settings</h3>
											<p>Customise as per your needs</p>
										</div>
										<div className="col grow">
											<div className="settings-item">
												<h4>Kibana</h4>
												<div className="form-check">
													<label htmlFor="yes">
														<input
															type="radio"
															name="kibana"
															defaultChecked={this.state.kibana}
															id="yes"
															onChange={() => this.setConfig('kibana', true)}
														/>
														Yes
													</label>

													<label htmlFor="no">
														<input
															type="radio"
															name="kibana"
															defaultChecked={!this.state.kibana}
															id="no"
															onChange={() => this.setConfig('kibana', false)}
														/>
														No
													</label>
												</div>
											</div>

											<div className="settings-item">
												<h4>Logstash</h4>
												<div className="form-check">
													<label htmlFor="yes2">
														<input
															type="radio"
															name="logstash"
															defaultChecked={this.state.logstash}
															id="yes2"
															onChange={() => this.setConfig('logstash', true)}
														/>
														Yes
													</label>

													<label htmlFor="no2">
														<input
															type="radio"
															name="logstash"
															defaultChecked={!this.state.logstash}
															id="no2"
															onChange={() => this.setConfig('logstash', false)}
														/>
														No
													</label>
												</div>
											</div>

											<div className="settings-item">
												<h4>Add-ons</h4>
												<div className="form-check">
													<label htmlFor="dejavu">
														<input
															type="checkbox"
															defaultChecked={this.state.dejavu}
															id="dejavu"
															onChange={() => this.toggleConfig('dejavu')}
														/>
														Dejavu
													</label>

													<label htmlFor="elasticsearch">
														<input
															type="checkbox"
															defaultChecked={this.state.elasticsearch}
															id="elasticsearch"
															onChange={() => this.toggleConfig('elasticsearch')}
														/>
														Elasticsearch-HQ
													</label>

													<label htmlFor="mirage">
														<input
															type="checkbox"
															defaultChecked={this.state.mirage}
															id="mirage"
															onChange={() => this.toggleConfig('mirage')}
														/>
														Mirage
													</label>
												</div>
											</div>
										</div>
									</li>
								)
						}
					</ul>

					{
						this.state.cluster.status === 'in progress'
							? <p style={{ textAlign: 'center' }}>Deployment is in progress. Please wait.</p>
							: (
								<div style={{ textAlign: 'right', marginBottom: 40 }}>
									<button
										className="ad-theme-btn"
										onClick={this.deleteCluster}
										style={{
											marginRight: 12,
											color: 'tomato',
										}}
									>
										Delete Cluster &nbsp; &nbsp;
										<i className="fas fa-trash-alt" />
									</button>

									<button className="ad-theme-btn primary" onClick={this.saveClusterSettings}>
										Save Cluster Settings &nbsp; &nbsp;
										<i className="fas fa-arrow-right" />
									</button>
								</div>
							)
					}
				</article>
			</section>
		);
	}
}
