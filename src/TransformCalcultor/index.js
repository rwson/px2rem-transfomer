import path from "path"
import fse from "fs-extra-promise"
import dirTree from "dir-tree-scanner"
import css from "css"
import cssmin from "cssmin"
import R from "ramda"
import toRegExp from "str-to-regexp"

const numPxUnitReg = /[0-9]+([.]{1}[0-9]+){0,1}px/;

export default class TransformCalcultor {
    constructor({ dirPath, width, scale, fileExt, filterList, fileName, distPath }) {
        this.dirPath = dirPath;
        this.fileExt = `.${fileExt}`;
        this.fileExtReg = toRegExp(`${this.fileExt}$`);
        this.filterList = filterList.filter((item) => item !== undefined);
        this.fileName = fileName;
        this.base = R.divide(this.width, R.multiply(10, scale));
        this.files = [];
        this.distPath = distPath;
    }

    /**
     * 开始转换
     */
    async tranform() {
    	let walkRes, tranformRes;
        walkRes = await this.walk();
        if (!walkRes) {
        	return {
                success: false
            };
        }
        this.files = walkRes;
        tranformRes = await this.px2rem();
        if (!tranformRes) {
            return {
                success: false
            };
        }
        return {
            success: true
        };
        console.log(tranformRes);
    }

    /**
     * 遍历目录获取相关后缀文件
     */
    async walk() {
        const { dirPath, fileExtReg } = this;
        let files = [];
        return new Promise((resolve, reject) => {
            dirTree.find(dirPath)
                .then((res) => {
                    resolve(files);
                }, (err) => {
                    resolve(false);
                }, ({ children }) => {
                    children = children
                        .map((file) => {
                            return file.filePath;
                        })
                        .filter((fPath) => fileExtReg.test(fPath))
                        .forEach((fPath) => {
                            if (files.indexOf(fPath) === -1) {
                                files.push(fPath);
                            }
                        });
                });
        });
    }

    async px2rem() {
        let str, parsed, ast, result;
    	const { base, files, filterList } = this;
        try {
            for (let src of files) {
                str = await fse.readFileAsync(src);
                str = str.toString("utf8");
                result = css.parse(str);
                ast = result.stylesheet;
                if (ast.rules.length) {
                    ast.rules.forEach((rule) => {
                        rule.declarations.forEach((dec) => {
                            if (!filterList.includes(dec.property)) {
                                
                            }
                        });
                    });
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async minifyFiles() {
        const { files } = this;
    }

    async buildToCss() {
        const { fileExt } = this;
        let res;
        return new Promise((resolve, reject) => {
            switch (fileExt.slice(1)) {
                case "less":
                    this.complieLess();
                    break;
                case "sass":
                    this.complieSass();
                    break;
                default:
                    break;
            }
            resolve(res);
        });
    }

    async complieLess() {
        const { files } = this;
    }

    async complieSass() {
        const { files } = this;
    }

}
