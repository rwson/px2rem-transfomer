import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import autobind from "autobind"
import { Input, Button } from "antd"

@observer([
	"filterStore"
])
class Filters extends Component {
	constructor(props) {
		super(props);
	}

	componentWillReciveProps() {
		console.log(this.props);
	}

	_renderFilterItem() {
		const { filterList } = this.props.filterStore;
		if (filterList.length) {
			console.log(filterList.map((filter) => {
				return (
					<div key={filter.id}>
						<Button>
							{ filter.title }
						</Button>
					</div>
				);
			}));

			return filterList.map((filter) => {
				return (
					<div key={filter.id}>
						<Button>
							{ filter.title }
						</Button>
					</div>
				);
			});
		}
		return null;
	}

	render() {
		return (
			<div className="filter-item">
				{ this._renderFilterItem() }
			</div>
		);
	}
}

@observer([
	"filterStore"
])
class FilterInput extends Component {
	constructor(props) {
		super(props);
	}

	@autobind
	_handleAdd(e) {
		const { filterStore } = this.props,
			{ target } = e;
		let { value } = target;
		value = value.trim();
		if (value.length) {
			filterStore.addFilter(value);
		}
		target.value = "";
		// console.log(filters.filterList);
	}

	render() {
		return (
			<div className="filter-input">
				<Input 
					onPressEnter={this._handleAdd}/>
			</div>
		);
	}
}

@observer([
	"filterStore"
])
class Tranformer extends Component {
  	constructor(props) {
  		super(props);
  	}

  	render() {
  		return (
			<div className="app-container">
	      		<FilterInput />
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