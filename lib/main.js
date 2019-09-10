"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const os = core.getInput('os', { required: true });
        // This should all be cached!
        //if(process.platform == "linux") {
        if (os == "linux") {
            var URL = "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh";
        }
        else {
            var URL = "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh";
        }
        const installerLocation = yield tc.downloadTool(URL);
        yield exec.exec("bash", [installerLocation, "-b", "-p", "$HOME/miniconda"]);
        //core.addPath("$HOME/miniconda/bin")
        yield exec.exec("$HOME/miniconda/bin/conda", ["config", "--set", "always_yes", "yes"]);
        // Strictly speaking, only the galaxy tests need planemo and samtools
        yield exec.exec("$HOME/miniconda/bin/conda", ["create", "-n", "foo", "-q", "--yes", "-c", "conda-forge", "-c", "bioconda", "python=3.7", "numpy", "scipy", "matplotlib==3.1.1", "nose", "flake8", "plotly", "pysam", "pyBigWig", "py2bit", "deeptoolsintervals", "planemo", "samtools"]);
        // Caching should end here
        // Install deepTools
        yield exec.exec("$HOME/miniconda/envs/foo/bin/python", ["-m", "pip", "install", ".", "--no-deps", "--ignore-installed", "-vv"]);
    });
}
run();
