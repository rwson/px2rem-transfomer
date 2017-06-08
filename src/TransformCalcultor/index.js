import path from "path"
import cp from "child_process"

import fse from "fs-extra-promise"
import dirTree from "dir-tree-scanner"
import css from "css"
import cssmin from "cssmin"


import R from "ramda"
import toRegExp from "str-to-regexp"

const numPxUnitReg = /[0-9]+([.]{1}[0-9]+){0,1}px/g;

export default class TransformCalcultor {
    constructor({ dirPath, width, scale, fileExt, filterList, fileName, distPath }) {
        this.dirPath = dirPath;
        this.fileExt = `.${fileExt}`;
        this.fileExtReg = toRegExp(`${this.fileExt}$`);
        this.ignores = filterList.filter((item) => item !== undefined);
        this.fileName = fileName;
        this.base = R.divide(width, 10);
        this.files = [];
        this.distfiles = [];
        this.distPath = distPath;
    }

    /**
     * 开始转换
     */
    async tranform() {
        const { fileExt, fileName } = this;
        let mergeRes, walkRes, tranformRes;
        walkRes = await this.walk();
        if (!walkRes) {
            return {
                success: false,
                message: "文件遍历出错!"
            };
        }
        this.files = walkRes;
        tranformRes = await this.px2rem();
        if (!tranformRes) {
            return {
                success: false,
                message: "单位转换出错!"
            };
        }
        if (fileName) {
            mergeRes = await this.minifyFiles();
            if (!mergeRes) {
                return {
                    success: false,
                    message: "文件压缩出错!"
                };
            }
        }
        return {
            success: true,
            message: "操作成功!"
        };
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

    /**
     * px转成rem单位处理并写入文件
     */
    async px2rem() {
        const { base, files, ignores, distPath } = this;
        let str, parsed, ast, result, value, matches, distfile;
        try {
            for (let src of files) {
                distfile = path.join(distPath, path.basename(src));
                str = await fse.readFileAsync(src);
                str = str.toString("utf8");
                result = css.parse(str);
                ast = result.stylesheet;
                if (ast.rules && ast.rules.length) {
                    ast.rules.forEach((rule) => {
                        switch (rule.type) {
                            case "rule":
                                if (rule.declarations && rule.declarations.length) {
                                    rule.declarations.forEach((dec) => {
                                        if (!ignores.includes(dec.property)) {
                                            value = dec.value;
                                            dec.value = value.replace(numPxUnitReg, (str) => {
                                                return `${R.divide(parseFloat(str), base).toFixed(2)}rem`;
                                            });
                                        }
                                    });
                                }
                                break;
                            case "media":
                                if (rule.rules && rule.rules.length) {
                                    rule.rules.forEach((sRule) => {
                                        if (sRule.declarations && sRule.declarations.length) {
                                            sRule.declarations.forEach((sDec) => {
                                                if (!ignores.includes(sDec.property)) {
                                                    value = sDec.value;
                                                    sDec.value = value.replace(numPxUnitReg, (str) => {
                                                        return `${R.divide(parseFloat(str), base).toFixed(2)}rem`;
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
                await fse.writeFileSync(distfile, css.stringify(result), {
                    encoding: "utf8"
                });
                this.distfiles.push(distfile);
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 压缩文件
     */
    async minifyFiles() {
        const { distfiles, distPath, fileName } = this,
        mergedPath = path.join(distPath, fileName);
        let cssStrs = [],
            tmp;
        try {
            for (let src of distfiles) {
                tmp = await fse.readFileAsync(src);
                tmp = tmp.toString("utf8");
                cssStrs.push(tmp);
                await fse.removeSync(src);
            }
            cssStrs = cssStrs.join("\n");
            cssStrs = cssmin(cssStrs);
            await fse.writeFileSync(mergedPath, cssStrs, {
                encoding: "utf8"
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
