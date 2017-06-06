import os from "os"
import path from "path"

import { remote } from "electron"
import NotificationPolyfill from "electron-notification-polyfill"

import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import * as uuid from "node-uuid"
import autobind from "autobind"
import { Switch, Select, Input, Button, Radio, Spin } from "antd"

import TransformCalcultor from "../TransformCalcultor"
import { ignores } from "../config";

const { Option } = Select,
	RadioGroup = Radio.Group;

const ignoreRules = ignores.map((name) => {
	return {
		name,
		id: uuid.v4()
	};
});

const { dialog } = remote;

const Notification = (process.platform === "win32" && parseFloat(os.release()) < 10) ?
    NotificationPolyfill : window.Notification;

const emojs = {
	happy: path.join(__dirname, "../imgs/happy.png"),
	sad: path.join(__dirname, "../imgs/sad.png"),
	embarrassed: path.join(__dirname, "../imgs/embarrassed.png")
};

let notification;

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
		const { filterStore } = this.props.store;
		filterStore.resetFilters();
		filterStore.addFilter(value);
	}

	@autobind
	_handleSwitch(showOptions) {
		const { filterStore } = this.props.store;
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
		const { fileExt, dirPath } = this.props.store.commonStore;
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
class ChooseDir extends Component {
	constructor(props) {
		super(props);
	}

	@autobind
	_chooseFile() {
		const { commonStore } = this.props.store;
		 dialog.showOpenDialog({
            type: "question",
            properties: ["openDirectory"],
            message: "请选择文件所在目录"
        }, (resp) => {
        	if (resp && resp.length) {
        		commonStore.selectDir(resp[0]);
        	} else {
        		notification = new Notification("px2rem", {
	                body: "请先选择要处理文件的所在目录!",
	                icon: emojs.embarrassed
        		});
        	}
        });
	}

	@autobind
	_chooseDistPath() {
		const { commonStore } = this.props.store;
		 dialog.showOpenDialog({
            type: "question",
            properties: ["openDirectory"],
            message: "请先选择处理后保存的目录"
        }, (resp) => {
        	if (resp && resp.length) {
        		commonStore.selectDistDir(resp[0]);
        	} else {
				notification = new Notification("px2rem", {
	                body: "请先选择处理后保存的目录!",
	                icon: emojs.embarrassed
        		});
        	}
        });
	}


	@autobind
	_handleChange(value) {
		const { commonStore } = this.props.store;
	}

	@autobind
	_handleSwitch(value) {
		const { commonStore } = this.props.store;
		commonStore.toggleCompress(value);
	}

	render() {
		const { dirPath, fileName, compress, distPath } = this.props.store.commonStore;
		return (
  			<div className="filter-rows">
				<div className="filter-item">
					<label className="left-label">
						选择所在目录
					</label>
					<div className="right-select">
						<Button type="primary" onClick={this._chooseFile}>请选择</Button>
						{
							dirPath.length > 0
							?
							(
								<span className="select-result" title={ "您选择的目录为:" + dirPath }>{ dirPath }</span>
							)
							:
							null
						}
					</div>
				</div>
				<div className="filter-item">
					<label className="left-label">
						选择释放目录
					</label>
					<div className="right-select">
						<Button type="primary" onClick={this._chooseDistPath}>请选择</Button>
						{
							distPath.length > 0
							?
							(
								<span className="select-result" title={ "您选择的目录为:" + distPath }>{ distPath }</span>
							)
							:
							null
						}
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
class FileCompressZip extends Component {
	constructor(props) {
		super(props);
	}

	@autobind
	_handleChange(e) {
		const { commonStore } = this.props.store;
		let { value } = e.target;
		commonStore.inputFileName(value);
	}

	@autobind
	_handleSwitch(value) {
		const { commonStore } = this.props.store;
		commonStore.toggleCompress(value);
	}

	render() {
		const { distPath, fileName, compress } = this.props.store.commonStore;
		return (
  			<div className="filter-rows">
				<div className="filter-item">
					<label className="left-label">
						合并压缩
					</label>
					<div className="right-select">
						<Switch className="right-select" defaultChecked={ false } onChange={this._handleSwitch}/>
					</div>
				</div>
				{
					compress
					?
					(
						<div>
							<div className="filter-item">
								<label className="left-label">
									保存文件名
								</label>
								<div className="right-select">
									<Input value={ fileName } onChange={ this._handleChange } />
								</div>
							</div>
						</div>
					)
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
class Tranformer extends Component {
  	constructor(props) {
  		super(props);
  		this.state = {
  			tranforming: false
  		};
  	}

  	@autobind
  	async _tranform() {
  		const { commonStore, filterStore } = this.props.store,
  			{ dirPath, width, scale, fileExt, compress, fileName, distPath } = commonStore,
  			{ filterList } = filterStore;
  		let tranformer, resp;
  		if(!dirPath) {
			notification = new Notification("px2rem", {
                body: "请先选择要处理文件的所在目录!",
                icon: emojs.embarrassed
    		});
  			return;
  		}
  		if(!distPath) {
			notification = new Notification("px2rem", {
                body: "请先选择处理后保存的目录!",
                icon: emojs.embarrassed
    		});
  			return;
  		}
  		this.setState({
  			tranforming: true
  		});
  		tranformer = new TransformCalcultor({ dirPath, width, scale, fileExt, filterList, fileName, distPath });
  		resp = await tranformer.tranform();
		this.setState({
  			tranforming: false
  		});
  		if(resp.success) {
			notification = new Notification("px2rem", {
				body: "执行成功!",
                icon: emojs.happy
    		});
  		} else {
  			notification = new Notification("px2rem", {
                body: "执行失败!",
                icon: emojs.sad
            });
  		}
  	}

  	render() {
  		const { tranforming } = this.state;
  		return (
			<div className="app-container">
	      		<Filters />
	      		<Scales />
	      		<FileType />
	      		<ChooseDir />
	      		<FileCompressZip />
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