import React, { Component } from 'react';
import {
 array, node, string, func, bool,
} from 'prop-types';
import styled, { css } from 'react-emotion';
import Stripe from 'react-stripe-checkout';
import { media } from '../../utils/media';
import ClickToShow from './ClickToShow';

const PricingCard = styled('div')`
	border-radius: 14px;
	width: 100%;
	max-width: 400px;
	margin: 30px auto;
	text-align: left;
	padding: 20px;
	background-color: #ffffff;
	color: #ffffff;
	box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.05);
	${media.ipadPro(css`
		max-width: 45%;
	`)};
	${media.small(css`
		max-width: 80%;
	`)};
`;

const PricingCardHeader = styled('div')``;

const PlanName = styled('div')`
	font-size: 1rem;
	font-weight: 600;
	line-height: 28px;
	text-transform: uppercase;
`;

const PriceWrapper = styled('div')`
	display: flex;
	align-items: center;
	font-size: 2rem;
	font-weight: 600;
	margin-bottom: 20px;

	> div {
		font-size: 0.875rem;
		opacity: 0.8;
		margin-left: 10px;
	}
`;

const Link = styled('a')`
	font-size: 1rem;
	text-transform: uppercase;
	text-decoration: none;
	font-weight: 600;
	font-weight: 700;
	border-bottom-width: 2px;
	border-bottom-style: dashed;
`;

const PricingList = styled('ul')`
	list-style: none;
	padding: 0;
	> li {
		display: flex;
		align-items: center;
		margin: 3px;
	}
`;

class NewPricingCard extends Component {
	state = {};

	render() {
		const {
			price,
			pricingList = [],
			name,
			onClickLink,
			children,
			linkColor,
			stripeName,
			amount,
			token,
			stripeKey,
			isCurrentPlan,
			buttonText,
			onClickButton,
			...rest
		} = this.props;
		return (
			<PricingCard {...rest}>
				<PricingCardHeader>
					<PlanName>{name}</PlanName>
					<PriceWrapper>
						{price}
						<div>/month</div>
					</PriceWrapper>
					<Stripe
						disabled={isCurrentPlan}
						name={stripeName}
						amount={amount}
						token={token}
						stripeKey={stripeKey}
					>
						{/* eslint-disable-next-line */}
						<Link onClick={onClickButton} css={{ color: linkColor }}>
							{buttonText}
						</Link>
					</Stripe>
				</PricingCardHeader>
				<PricingList css={{ fontWeight: 700 }}>
					{pricingList.map(list => (
						<li key={list}>{list}</li>
					))}
				</PricingList>
				{children && (
					<ClickToShow>
						<PricingList css={{ fontSize: '0.875rem', fontWeight: 600 }}>
							{children}
						</PricingList>
					</ClickToShow>
				)}
			</PricingCard>
		);
	}
}
NewPricingCard.defaultProps = {
	price: undefined,
	linkColor: undefined,
	pricingList: undefined,
	name: undefined,
	onClickLink: undefined,
	children: undefined,
	onClickButton: undefined,
	buttonText: 'Subscribe',
};
NewPricingCard.propTypes = {
	price: string,
	linkColor: string,
	pricingList: array,
	name: string,
	onClickLink: func,
	children: node,
	isCurrentPlan: bool.isRequired,
	buttonText: string,
	onClickButton: func,
};
export default NewPricingCard;
