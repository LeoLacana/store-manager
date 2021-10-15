const fs = require('fs').promises;
const util = require('util');
const { exec: callbackExec } = require('child_process');
const path = require('path');

const exec = util.promisify(callbackExec);

const mongoDbUrl = 'mongodb://localhost:27017';
const url = 'http://localhost:3000';
const NPX_NYC_COMMAND =
  (unit) => `npx nyc --all --include ${unit} --reporter json-summary mocha test/unit/${unit}.js --exit`;

function readCoverageFile() {
  const COVERAGE_FILE_PATH = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
  return fs.readFile(COVERAGE_FILE_PATH).then(JSON.parse);
}

describe('11 - Escreva testes para seus models', () => {
  beforeAll(async () => {
    await exec(NPX_NYC_COMMAND('models'));
  });

  afterAll(async () => {
    await exec('rm -rf coverage .nyc_output');
  });

  it('Será validado que cobertura total das linhas dos arquivos na pasta `models` é maior ou igual a 80%', async () => {
    const coverageResults = await readCoverageFile();
    expect(coverageResults.total.lines.pct).toBeGreaterThanOrEqual(80);
  });
});

describe('12 - Escreva testes para seus services', () => {
  beforeAll(async () => {
    await exec(NPX_NYC_COMMAND('services'));
  });

  afterAll(async () => {
    await exec('rm -rf coverage .nyc_output');
  });

  it('Será validado que cobertura total das linhas dos arquivos na pasta `services` é maior ou igual a 80%', async () => {
    const coverageResults = await readCoverageFile();
    expect(coverageResults.total.lines.pct).toBeGreaterThanOrEqual(80);
  });
});

describe('13 - Escreva testes para seus controllers', () => {
  beforeAll(async () => {
    await exec(NPX_NYC_COMMAND('controllers'));
  });

  afterAll(async () => {
    await exec('rm -rf coverage .nyc_output');
  });

  it('Será validado que cobertura total das linhas dos arquivos na pasta `controllers` é maior ou igual a 80%', async () => {
    const coverageResults = await readCoverageFile();
    expect(coverageResults.total.lines.pct).toBeGreaterThanOrEqual(80);
  });
});
