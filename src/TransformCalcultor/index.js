import path from "path"
import fse from "fs-extra-promise"
import dirFiles from "dir-files"
import css from "css"
import cssmin from "cssmin"
import R from "ramda"

export default class TransformCalcultor {
	constructor({ dirPath, width, scale, fileExt, filterList, fileName }) {
		this.dirPath = dirPath;
		this.fileExt = fileExt;
		this.filterList = filterList.filter((item) => item !== undefined);
		this.fileName = fileName;
		this.base = R.divide(this.width, R.multiply(10, scale));
		this.files = [];
		console.log(this);
	}

	async tranform() {
	}

	async concatFiles() {}

	async walk() {
		const { dir, fileExt } = this;
	}

	async merge() {
		const { fileName } = this;
	}

	async buildToCss() {
		const { fileExt } = this;
	}
}

async function compress(files) {
	return new Promise((resolve, reject) => {
		
	});
}


