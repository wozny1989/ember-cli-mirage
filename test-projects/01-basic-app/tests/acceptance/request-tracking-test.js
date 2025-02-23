import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import ENV from 'basic-app/config/environment';
import promiseAjax from '../helpers/promise-ajax';

let App;

module('Acceptance | Enabling request tracking', function (hooks) {
  hooks.afterEach(function () {
    window.server.shutdown();
    run(App, 'destroy');
    ENV['ember-cli-mirage'].enabled = undefined;
  });

  test('Request tracking defaults to false', async function (assert) {
    App = startApp();

    await promiseAjax({
      method: 'GET',
      url: '/users',
    });

    assert.equal(
      window.server.pretender.handledRequests.length,
      0,
      'request tracking should be false by default'
    );
  });

  test('Request tracking treats undefined config as false', async function (assert) {
    ENV['ember-cli-mirage'] = { trackRequests: undefined };
    App = startApp();

    await promiseAjax({
      method: 'GET',
      url: '/users',
    });

    assert.equal(
      window.server.pretender.handledRequests.length,
      0,
      'request tracking should be false when undefined in config'
    );
  });

  test('Request tracking can be set to true in config', async function (assert) {
    ENV['ember-cli-mirage'] = { trackRequests: true };
    App = startApp();

    await promiseAjax({
      method: 'GET',
      url: '/users',
    });

    assert.equal(
      window.server.pretender.handledRequests.length,
      1,
      'request tracking can be turned on in config and track requests'
    );
    assert.equal(
      window.server.pretender.handledRequests[0].method,
      'GET',
      'tracked request method should match the requests method'
    );
  });
});
