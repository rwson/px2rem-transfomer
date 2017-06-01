import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import * as uuid from "node-uuid"
import autobind from "autobind"
import { Switch, Select, Input, Button, Radio, Spin } from "antd"

import { ignores } from "../config";

const { Option } = Select,
	RadioGroup = Radio.Group;

const ignoreRules = ignores.map((name) => {
	return {
		name,
		id: uuid.v4()
	};
});

@inject([
	"store"
])
@observer
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
							选择忽略规则
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

@inject([
	"store"
])
@observer
class Scales extends Component {
  	constructor(props) {
  		super(props);
  	}

  	@autobind
  	_handleChange(e) {
  		const { commonStore } = this.props.store,
  			{ value } = e.target;
  		commonStore.modifyWidth(value);
  	}

  	@autobind
  	_handleScaleChange(e) {
  		const { commonStore } = this.props.store,
  			{ value } = e.target;
  		commonStore.modifyScale(value);
  	}

  	render() {
  		const { width, scale } = this.props.store.commonStore;
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
	"store"
])
@observer
class FileType extends Component {
	constructor(props) {
		super(props);
	}

	@autobind
	_handleChange(e) {
		const { commonStore } = this.props.store,
			{ value } = e.target;
		commonStore.modifyFileExt(value);
	}

	render() {
		const { fileExt } = this.props.store.commonStore;
		return (
  			<div className="filter-rows">
				<div className="filter-item">
					<label className="left-label">
						文件后缀名
					</label>
					<div className="right-select">
						<RadioGroup onChange={ this._handleChange } value={ fileExt }>
					        <Radio value="css">css</Radio>
					        <Radio value="less">less</Radio>
					        <Radio value="sass">sass</Radio>
				      	</RadioGroup>
					</div>
				</div>
  			</div>
		);
	}
}

@inject([
	"store"
])
@observer
class Tranformer extends Component {
  	constructor(props) {
  		super(props);
  		this.state = {
  			tranforming: false
  		};
  	}

  	@autobind
  	_tranform() {
  		this.setState({
  			tranforming: true
  		});
  		console.log(this.props);
  	}

  	render() {
  		const { tranforming } = this.state;
  		return (
			<div className="app-container">
	      		<Filters />
	      		<Scales />
	      		<FileType />
	      		<div className="button-container">
	      			<Button type="primary" size="large" onClick={this._tranform}>开始转换</Button>
	      		</div>
	      		{
	      			tranforming
	      			?
	      			(
			      		<div className="tranforming">
			      			<Spin size="large" tip="正在转换,请稍候...." />
			      		</div>	      				
      				)
      				:
      				null
	      		}
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