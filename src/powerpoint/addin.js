/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.PowerPoint) {
    window.addEventListener('message', getMessage, false);

    Office.context.document.getActiveViewAsync(activeViewCallback);

    Office.context.document.addHandlerAsync(
      Office.EventType.ActiveViewChanged,
      activeViewChanged
    );
  }
});

function loadURL(mode) {
  const room = Office.context.document.settings.get('room');
  const series = Office.context.document.settings.get('series');
  const question = Office.context.document.settings.get('question');
  if (room) {
    document.getElementById('arsnova').src =
      `/${mode}/${room}/series/${series}/${question}`;
  }
}

function activeViewCallback(result) {
  if (result.status === Office.AsyncResultStatus.Succeeded) {
    if (result.value === 'edit') {
      loadURL('edit');
    } else if (result.value === 'read') {
      loadURL('present');
    }
  }
}

function activeViewChanged() {
  Office.context.document.getActiveViewAsync(activeViewCallback);
}

function getMessage(event) {
  saveURL(new URL(event.data));
}

function saveURL(url) {
  const matches = /\/edit\/(\d+)\/series\/([^/]+)\/(\d+)/.exec(url.pathname);
  if (matches) {
    const [, room, series, question] = matches;
    Office.context.document.settings.set('room', room);
    Office.context.document.settings.set('series', series);
    Office.context.document.settings.set('question', question);
    Office.context.document.settings.saveAsync();
  }
}
