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
			if (Array.isArray(title)) {
				title.forEach((title) => {
					this.filterList.push(new FilterItem({title}));
				});
			} else {
				this.filterList.push(new FilterItem({title}));
			}
		}
	}

	@autobind
	@action
	removeFilter(id) {
		this.filterList = this.filterList.filter(item => item.id !== id);
	}

	@autobind
	@action
	resetFilters() {
		this.filterList = [];
	}
}

export const filterStore = new Filters();
