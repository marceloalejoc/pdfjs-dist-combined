/* Copyright 2017 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PasswordPrompt = undefined;

var _ui_utils = require('pdfjs-web/ui_utils');

var _overlay_manager = require('pdfjs-web/overlay_manager');

var _pdfjs = require('pdfjs-web/pdfjs');

var PasswordPrompt = function PasswordPromptClosure() {
  function PasswordPrompt(options) {
    this.overlayName = options.overlayName;
    this.container = options.container;
    this.label = options.label;
    this.input = options.input;
    this.submitButton = options.submitButton;
    this.cancelButton = options.cancelButton;
    this.updateCallback = null;
    this.reason = null;
    this.submitButton.addEventListener('click', this.verify.bind(this));
    this.cancelButton.addEventListener('click', this.close.bind(this));
    this.input.addEventListener('keydown', function (e) {
      if (e.keyCode === 13) {
        this.verify();
      }
    }.bind(this));
    _overlay_manager.OverlayManager.register(this.overlayName, this.container, this.close.bind(this), true);
  }
  PasswordPrompt.prototype = {
    open: function PasswordPrompt_open() {
      _overlay_manager.OverlayManager.open(this.overlayName).then(function () {
        this.input.type = 'password';
        this.input.focus();
        var promptString = _ui_utils.mozL10n.get('password_label', null, 'Enter the password to open this PDF file.');
        if (this.reason === _pdfjs.PasswordResponses.INCORRECT_PASSWORD) {
          promptString = _ui_utils.mozL10n.get('password_invalid', null, 'Invalid password. Please try again.');
        }
        this.label.textContent = promptString;
      }.bind(this));
    },
    close: function PasswordPrompt_close() {
      _overlay_manager.OverlayManager.close(this.overlayName).then(function () {
        this.input.value = '';
        this.input.type = '';
      }.bind(this));
    },
    verify: function PasswordPrompt_verify() {
      var password = this.input.value;
      if (password && password.length > 0) {
        this.close();
        return this.updateCallback(password);
      }
    },
    setUpdateCallback: function PasswordPrompt_setUpdateCallback(updateCallback, reason) {
      this.updateCallback = updateCallback;
      this.reason = reason;
    }
  };
  return PasswordPrompt;
}();
exports.PasswordPrompt = PasswordPrompt;