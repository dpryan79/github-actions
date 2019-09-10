//const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');

async function run() {
    //const os = core.getInput('os', {required: true});

    // This should all be cached!
    if(process.platform == "linux") {
        var URL = "https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh";
        var home = "/home/runner";
    } else {
        var URL = "https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-x86_64.sh";
        var home = "/Users/home/runner";
    }

    // Otherwise conda can't install for some reason
    await io.mkdirP(home.concat('/.conda'));

    const installerLocation = await tc.downloadTool(URL);

    await exec.exec("bash", [installerLocation, "-b", "-p", home.concat("/miniconda")]);

    // core.addPath(home.concat("/miniconda/bin"))

    await exec.exec(home.concat("/miniconda/bin/conda"), ["config", "--set", "always_yes", "yes"]);

    // Strictly speaking, only the galaxy tests need planemo and samtools
    await exec.exec(home.concat("/miniconda/bin/conda"), ["create", "-n", "foo", "-q", "--yes", "-c", "conda-forge", "-c", "bioconda", "python=3.7", "numpy", "scipy", "matplotlib==3.1.1", "nose", "flake8", "plotly", "pysam", "pyBigWig", "py2bit", "deeptoolsintervals", "planemo", "samtools"]);

    // Caching should end here

    // Install deepTools
    await exec.exec(home.concat("/miniconda/envs/foo/bin/python"), ["-m", "pip", "install", ".", "--no-deps", "--ignore-installed", "-vv"])
}

run();
