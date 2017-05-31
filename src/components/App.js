import React, { Component } from "react"
import { observer, inject } from "mobx-react"
// import css from "css";
import * as uuid from "node-uuid"
import autobind from "autobind"
import { Switch, Select, Input } from "antd"
const { Option } = Select;
import { ignores } from "../config";

const ignoreRules = ignores.map((name) => {
	return {
		name,
		id: uuid.v4()
	};
});

@inject([
	"filterStore"
])
class Filters extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showOptions: false
		};
	}

	_renderIgnores() {
		return ignoreRules.map((ignore) => {
			return (
				<Option key={ ignore.id } value={ ignore.name }>
					{ ignore.name }
				</Option>
			);
		});
	}

	@autobind
	_handleChange(value) {
		const { filterStore } = this.props;
		filterStore.resetFilters();
		filterStore.addFilter(value);
	}

	@autobind
	_handleSwitch(showOptions) {
		const { filterStore } = this.props;
		this.setState({
			showOptions
		});
		if (!showOptions) {
			filterStore.resetFilters();
		}
	}

	render() {
		const { showOptions } = this.state;
		return (
			<div className="filter-rows">
				<div className="filter-item">
					<label className="left-label">
						忽略样式规则
					</label>
					<Switch className="right-select" defaultChecked={ false } onChange={this._handleSwitch}/>
				</div>
				{
					showOptions
					?
					(<div className="filter-item">
						<label className="left-label">
							选择规则
						</label>
						<Select
							className="right-select"
						    mode="tags"
						    style={{ width: "200px" }}
						    searchPlaceholder="选择不进行计算的样式规则"
						    onChange={this._handleChange}
						  >
						  	{ this._renderIgnores() }
						  </Select>
					</div>)
					:
					null
				}
			</div>
		);
	}
}

class Scales extends Component {
  	constructor(props) {
  		super(props);
  		this.state = {
  			width: 750,
  			scale: 1
  		};
  	}

  	@autobind
  	_handleChange(e) {
  		let { value } = e.target;
  		this.setState({
  			width: value
  		});
  	}

  	@autobind
  	_handleScaleChange(e) {
  		let { value } = e.target;
  		this.setState({
  			scale: value
  		});
  	}

  	render() {
  		const { width, scale } = this.state;
  		return (
  			<div className="filter-rows">
				<div className="filter-item">
					<label className="left-label">
						设计稿宽度
					</label>
					<div className="right-select">
						<Input placeholder="请输入设计稿宽度" value={ width } onChange={ this._handleChange } />
					</div>
				</div>
				<div className="filter-item">
					<label className="left-label">
						缩放比例
					</label>
					<div className="right-select">
						<Input placeholder="请输入缩放比例" value={ scale } onChange={ this._handleScaleChange } />
					</div>
				</div>
  			</div>
		);
  	}
}

@inject([
	"filterStore"
])
class Tranformer extends Component {
  	constructor(props) {
  		super(props);
  	}

  	render() {
  		return (
			<div className="app-container">
	      		<Filters />
	      		<Scales />
	      	</div>
		);
  	}
}

@observer
class App extends Component {
  	constructor(props) {
  		super(props);
  	}

  	render() {
	    return (
	      	<div>
	      		<Tranformer />
	      	</div>
	    );
  	}
}

export default App;