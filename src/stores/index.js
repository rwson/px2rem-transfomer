import { observable, computed, action } from "mobx"
import autobind from "autobind"

/**
 * 过滤文件类型的后缀
 */
class FilterItem {
	constructor({title}) {
		this.title = title;
		this.id = Math.random().toString(16).slice(2, 10);
		return this;
	}
}

/**
 * 所有过滤项目
 */
class Filters {
	@observable
	filterList = [];
	
	@autobind
	@action
	addFilter(title) {
		if (title) {
			const filter = new FilterItem({title});
			console.log(filter);
			this.filterList.push(filter);
		}
	}

	@autobind
	@action
	removeFilter(id) {
		this.filterList = this.filterList.filter(item => item.id !== id);
	}
}

export const filterStore = new Filters();
