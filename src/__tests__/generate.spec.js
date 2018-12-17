var assert = require('chai').assert;
var expect = require('chai').expect;
const sinon = require('sinon');
var generate = require('../generate');

const config = {
    output: './src/__tests__/output',
    namespace: 'really-great-translated-app',
};

describe('generator', () => {
    beforeEach(() => {
        sinon.stub(process, 'exit');
        sinon.stub(console, 'error');
    });

    afterEach(() => {
        process.exit.restore();
        console.error.restore();
    });

    it('exits with error with unsupported languages', () => {
        config.path = './src/__tests__/__fixtures__/failureSet';

        generate(config);

        assert(process.exit.called);
        assert(process.exit.calledWith(1), 'Process.exit should have been called with 1');
        assert(console.error.called);
        assert(console.error.calledWith('The following languages are not supported: abc'));
    });

    it('succeeds with only supported languages', () => {
        config.path = './src/__tests__/__fixtures__/successSet';

        generate(config);

        assert(!process.exit.called);
        assert(!console.error.called);
    });
});
