import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import autobind from "autobind"
import { Select } from "antd"
const { Option } = Select;

@inject([
	"filterStore"
])
class Filters extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="filter-item">
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